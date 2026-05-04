// File: resources/js/pages/admin/users/index.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { Department } from '@/types/department';
import type { User } from '@/types/user';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Edit, GraduationCap, Plus, Search, Shield, Trash2, UserCog, Users, XCircle } from 'lucide-react';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────

// Spatie returns full role objects, not plain strings
interface SpatieRole {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot?: Record<string, unknown>;
}

interface UserWithRelations extends User {
    department?: Department;
    roles?: (SpatieRole | string)[];
}

// Extract plain role name from Spatie role object or string
function getRoleName(role: SpatieRole | string): string {
    return typeof role === 'string' ? role : role.name;
}

interface PaginatedUsers {
    data: UserWithRelations[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    users: PaginatedUsers;
}

// ─── Role Badge ───────────────────────────────────────────

const roleConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
    admin: {
        label: 'Admin',
        icon: <Shield className="h-3 w-3" />,
        className: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    lecturer: {
        label: 'Dosen',
        icon: <UserCog className="h-3 w-3" />,
        className: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    student: {
        label: 'Mahasiswa',
        icon: <GraduationCap className="h-3 w-3" />,
        className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
};

function RoleBadge({ role }: { role: string }) {
    const config = roleConfig[role] ?? {
        label: role,
        icon: <Users className="h-3 w-3" />,
        className: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${config.className}`}>
            {config.icon}
            {config.label}
        </span>
    );
}

// ─── Main Page ────────────────────────────────────────────

export default function UsersIndex({ users }: Props) {
    const { props } = usePage<{ flash?: { success?: string; error?: string } }>();
    const flash = props.flash;

    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search }, { preserveState: true });
    };

    const handleDelete = (user: UserWithRelations) => {
        if (!confirm(`Yakin ingin menghapus pengguna "${user.name}"? Akun akan di-nonaktifkan (soft delete).`)) return;
        setDeletingId(user.id);
        router.delete(route('admin.users.destroy', user.id), {
            onFinish: () => setDeletingId(null),
        });
    };

    // Format tanggal
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <AppLayout title="Kelola Pengguna">
            <Head title="Kelola Pengguna - Repository KTI" />

            {/* ─── Flash Message ──────────────────────────── */}
            {flash?.success && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {flash.error}
                </div>
            )}

            {/* ─── Header ─────────────────────────────────── */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Daftar Pengguna</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Total <span className="font-semibold text-gray-700">{users.total}</span> pengguna terdaftar
                    </p>
                </div>
                <Link href={route('admin.users.create')}>
                    <Button id="btn-tambah-pengguna" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Pengguna
                    </Button>
                </Link>
            </div>

            {/* ─── Search Bar ─────────────────────────────── */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        id="input-search-users"
                        type="text"
                        placeholder="Cari nama, email, NIM, atau NIDN..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <Button type="submit" variant="outline" className="gap-2">
                    <Search className="h-4 w-4" />
                    Cari
                </Button>
            </form>

            {/* ─── Table ──────────────────────────────────── */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Pengguna</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Role</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 md:table-cell">Departemen</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 lg:table-cell">NIM / NIDN</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 xl:table-cell">Bergabung</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                                        <Users className="mx-auto mb-3 h-10 w-10 opacity-30" />
                                        <p className="font-medium">Tidak ada pengguna ditemukan</p>
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className={`transition-colors hover:bg-gray-50 ${user.deleted_at ? 'opacity-50' : ''}`}>
                                        {/* Pengguna */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar */}
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-gray-900">{user.name}</p>
                                                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-4 py-3">
                                            {user.roles && user.roles.length > 0 ? (
                                                <RoleBadge role={getRoleName(user.roles[0])} />
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>

                                        {/* Departemen */}
                                        <td className="hidden px-4 py-3 md:table-cell">
                                            <span className="text-gray-600">{user.department?.name ?? <span className="text-gray-400">—</span>}</span>
                                        </td>

                                        {/* NIM / NIDN */}
                                        <td className="hidden px-4 py-3 lg:table-cell">
                                            <span className="font-mono text-xs text-gray-600">
                                                {user.nim ?? user.nidn ?? <span className="text-gray-400">—</span>}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3 text-center">
                                            {user.is_active ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                                    <XCircle className="h-3 w-3" />
                                                    Nonaktif
                                                </span>
                                            )}
                                        </td>

                                        {/* Bergabung */}
                                        <td className="hidden px-4 py-3 text-xs text-gray-500 xl:table-cell">{formatDate(user.created_at)}</td>

                                        {/* Aksi */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={route('admin.users.edit', user.id)}>
                                                    <Button id={`btn-edit-user-${user.id}`} variant="outline" size="sm" className="gap-1.5">
                                                        <Edit className="h-3.5 w-3.5" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    id={`btn-delete-user-${user.id}`}
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() => handleDelete(user)}
                                                    disabled={deletingId === user.id}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ─── Pagination ──────────────────────── */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-500">
                            Menampilkan {users.from}–{users.to} dari {users.total} pengguna
                        </p>
                        <div className="flex gap-1">
                            {users.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    preserveScroll
                                    className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url
                                              ? 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                                              : 'cursor-not-allowed border border-gray-100 bg-white text-gray-300'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
