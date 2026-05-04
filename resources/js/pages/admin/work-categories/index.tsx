// File: resources/js/pages/admin/work-categories/index.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { WorkCategory } from '@/types/work-category';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit,
    Layers,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────

interface PaginatedCategories {
    data: WorkCategory[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    categories: PaginatedCategories;
}

// ─── Main Page ────────────────────────────────────────────

export default function WorkCategoriesIndex({ categories }: Props) {
    const { props } = usePage<{ flash?: { success?: string; error?: string } }>();
    const flash = props.flash;

    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.work-categories.index'), search ? { search } : {}, { preserveState: true });
    };

    const handleDelete = (cat: WorkCategory) => {
        if (!confirm(`Yakin ingin menghapus kategori "${cat.name}"?`)) return;
        setDeletingId(cat.id);
        router.delete(route('admin.work-categories.destroy', cat.id), {
            onFinish: () => setDeletingId(null),
        });
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <AppLayout title="Kelola Kategori Karya">
            <Head title="Kategori Karya - Repository KTI" />

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
                    <h1 className="text-2xl font-bold text-gray-900">Kategori Karya</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Total <span className="font-semibold text-gray-700">{categories.total}</span> kategori
                    </p>
                </div>
                <Link href={route('admin.work-categories.create')}>
                    <Button id="btn-tambah-category" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        id="input-search-categories"
                        type="text"
                        placeholder="Cari nama kategori..."
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
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Kategori</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 md:table-cell">Slug</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 lg:table-cell">Deskripsi</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 xl:table-cell">Dibuat</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center">
                                        <Layers className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                                        <p className="font-medium text-gray-400">Belum ada kategori</p>
                                    </td>
                                </tr>
                            ) : (
                                categories.data.map((cat) => (
                                    <tr key={cat.id} className="transition-colors hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-100">
                                                    <Layers className="h-4 w-4 text-pink-600" />
                                                </div>
                                                <span className="font-medium text-gray-900">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="hidden px-4 py-3 md:table-cell">
                                            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{cat.slug}</code>
                                        </td>
                                        <td className="hidden max-w-xs px-4 py-3 lg:table-cell">
                                            <span className="line-clamp-1 text-gray-500">{cat.description ?? '—'}</span>
                                        </td>
                                        <td className="hidden px-4 py-3 text-xs text-gray-500 xl:table-cell">
                                            {formatDate(cat.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={route('admin.work-categories.edit', cat.id)}>
                                                    <Button id={`btn-edit-cat-${cat.id}`} variant="outline" size="sm" className="gap-1.5">
                                                        <Edit className="h-3.5 w-3.5" /> Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    id={`btn-delete-cat-${cat.id}`}
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(cat)}
                                                    disabled={deletingId === cat.id}
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
                {categories.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-500">
                            {categories.from && categories.to
                                ? `Menampilkan ${categories.from}–${categories.to} dari ${categories.total}`
                                : `Total ${categories.total}`}
                        </p>
                        <div className="flex gap-1">
                            {categories.links.map((link, i) => (
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
