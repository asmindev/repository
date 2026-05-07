// File: resources/js/pages/admin/users/index.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PaginationNav } from '@/components/ui/pagination-nav';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Department } from '@/types/department';
import type { User } from '@/types/user';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Edit, GraduationCap, Plus, Search, Shield, Trash2, UserCog, Users, XCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
    is_supervisors: boolean;
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
        className: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400',
    },
    lecturer: {
        label: 'Dosen',
        icon: <UserCog className="h-3 w-3" />,
        className: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400',
    },
    student: {
        label: 'Mahasiswa',
        icon: <GraduationCap className="h-3 w-3" />,
        className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
};

function RoleBadge({ role }: { role: string }) {
    const config = roleConfig[role] ?? {
        label: role,
        icon: <Users className="h-3 w-3" />,
        className: 'bg-muted text-muted-foreground border-border',
    };

    return (
        <Badge variant="outline" className={cn("gap-1 font-medium", config.className)}>
            {config.icon}
            {config.label}
        </Badge>
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
        <AppLayout header={<h1 className="font-bold">Kelola Pengguna</h1>}>
            <Head title="Kelola Pengguna - Repository KTI" />

            {/* ─── Flash Message ──────────────────────────── */}
            {flash?.success && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary shadow-sm animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-sm animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {flash.error}
                </div>
            )}

            {/* ─── Header ─────────────────────────────────── */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Daftar Pengguna</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Total <span className="font-semibold text-foreground">{users.total}</span> pengguna terdaftar
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
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        id="input-search-users"
                        type="text"
                        placeholder="Cari nama, email, NIM, atau NIDN..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background py-2 pr-4 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                    />
                </div>
                <Button type="submit" variant="outline" className="gap-2">
                    <Search className="h-4 w-4" />
                    Cari
                </Button>
            </form>

            {/* ─── Table ──────────────────────────────────── */}
            <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-semibold text-muted-foreground">Pengguna</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Role</TableHead>
                                <TableHead className="hidden font-semibold text-muted-foreground md:table-cell">Departemen</TableHead>
                                <TableHead className="hidden font-semibold text-muted-foreground lg:table-cell">NIM / NIDN</TableHead>
                                <TableHead className="text-center font-semibold text-muted-foreground">Status</TableHead>
                                <TableHead className="hidden font-semibold text-muted-foreground xl:table-cell">Bergabung</TableHead>
                                <TableHead className="text-center font-semibold text-muted-foreground">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y">
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="h-10 w-10 text-muted-foreground/30" />
                                            <p className="font-medium text-muted-foreground">Tidak ada pengguna ditemukan</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id} className={cn("transition-colors hover:bg-muted/30", user.deleted_at && "opacity-50 grayscale bg-muted/20")}>
                                        {/* Pengguna */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {/* Avatar */}
                                                <Avatar className="h-9 w-9 border shadow-sm">
                                                    <AvatarImage
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                                        alt={user.name}
                                                    />
                                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-foreground">{user.name}</p>
                                                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Role */}
                                        <TableCell>
                                            {user.roles && user.roles.length > 0 ? (
                                                <div className="flex flex-col gap-1 items-start">
                                                    <RoleBadge role={getRoleName(user.roles[0])} />
                                                    {user.is_supervisors && (
                                                        <Badge variant="outline" className="bg-blue-500/5 text-blue-700 border-blue-500/20 gap-1 text-[10px] py-0 px-1.5 h-4.5">
                                                            <CheckCircle2 className="h-2.5 w-2.5" />
                                                            Supervisors
                                                        </Badge>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </TableCell>

                                        {/* Departemen */}
                                        <TableCell className="hidden md:table-cell">
                                            <span className="text-foreground/80">{user.department?.name ?? <span className="text-muted-foreground">—</span>}</span>
                                        </TableCell>

                                        {/* NIM / NIDN */}
                                        <TableCell className="hidden lg:table-cell">
                                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                                {user.nim ?? user.nidn ?? <span className="text-muted-foreground/50">—</span>}
                                            </code>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell className="text-center">
                                            {user.is_active ? (
                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 py-0 px-2 h-5">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Aktif
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 gap-1 py-0 px-2 h-5 hover:bg-destructive/10 shadow-none">
                                                    <XCircle className="h-3 w-3" />
                                                    Nonaktif
                                                </Badge>
                                            )}
                                        </TableCell>

                                        {/* Bergabung */}
                                        <TableCell className="hidden text-xs text-muted-foreground xl:table-cell">{formatDate(user.created_at)}</TableCell>

                                        {/* Aksi */}
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Link href={route('admin.users.edit', user.id)}>
                                                    <Button id={`btn-edit-user-${user.id}`} variant="outline" size="icon" className="h-8 w-8" title="Edit">
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    id={`btn-delete-user-${user.id}`}
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => handleDelete(user)}
                                                    disabled={deletingId === user.id}
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* ─── Pagination ──────────────────────── */}
                <PaginationNav links={users.links} from={users.from} to={users.to} total={users.total} />
            </div>
        </AppLayout>
    );
}
