// File: resources/js/pages/admin/departments/index.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { Department, Faculty } from '@/types/department';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    Edit,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────

interface PaginatedDepartments {
    data: (Department & { faculty?: Faculty })[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    departments: PaginatedDepartments;
}

// ─── Main Page ────────────────────────────────────────────

export default function DepartmentsIndex({ departments }: Props) {
    const { props } = usePage<{ flash?: { success?: string; error?: string } }>();
    const flash = props.flash;

    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.departments.index'), search ? { search } : {}, { preserveState: true });
    };

    const handleDelete = (dept: Department) => {
        if (!confirm(`Yakin ingin menghapus departemen "${dept.name}"?`)) return;
        setDeletingId(dept.id);
        router.delete(route('admin.departments.destroy', dept.id), {
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <AppLayout title="Kelola Departemen">
            <Head title="Departemen - Repository KTI" />

            {/* Flash */}
            {flash?.success && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {flash.success}
                </div>
            )}

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Departemen / Program Studi</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Total <span className="font-semibold text-gray-700">{departments.total}</span> departemen
                    </p>
                </div>
                <Link href={route('admin.departments.create')}>
                    <Button id="btn-tambah-department" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Departemen
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        id="input-search-departments"
                        type="text"
                        placeholder="Cari nama departemen..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <Button type="submit" variant="outline" className="gap-2">
                    <Search className="h-4 w-4" /> Cari
                </Button>
            </form>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Departemen</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 md:table-cell">Fakultas</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 lg:table-cell">Slug</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 xl:table-cell">Deskripsi</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {departments.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center">
                                        <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                                        <p className="font-medium text-gray-400">Belum ada departemen</p>
                                    </td>
                                </tr>
                            ) : (
                                departments.data.map((dept) => (
                                    <tr key={dept.id} className="transition-colors hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                                                    <Building2 className="h-4 w-4 text-indigo-600" />
                                                </div>
                                                <span className="font-medium text-gray-900">{dept.name}</span>
                                            </div>
                                        </td>
                                        <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                                            {dept.faculty?.name ?? <span className="text-gray-400">—</span>}
                                        </td>
                                        <td className="hidden px-4 py-3 lg:table-cell">
                                            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{dept.slug}</code>
                                        </td>
                                        <td className="hidden max-w-xs px-4 py-3 xl:table-cell">
                                            <span className="line-clamp-1 text-gray-500">{dept.description ?? '—'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={route('admin.departments.edit', dept.id)}>
                                                    <Button id={`btn-edit-dept-${dept.id}`} variant="outline" size="sm" className="gap-1.5">
                                                        <Edit className="h-3.5 w-3.5" /> Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    id={`btn-delete-dept-${dept.id}`}
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(dept)}
                                                    disabled={deletingId === dept.id}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {departments.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-500">
                            {departments.from && departments.to
                                ? `Menampilkan ${departments.from}–${departments.to} dari ${departments.total}`
                                : `Total ${departments.total}`}
                        </p>
                        <div className="flex gap-1">
                            {departments.links.map((link, i) => (
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
