// File: resources/js/pages/admin/works/trashed.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { Work } from '@/types/work';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    BookOpen,
    FileText,
    RotateCcw,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────

interface PaginatedWorks {
    data: Work[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Filters {
    search?: string;
}

interface Props {
    works: PaginatedWorks;
    filters: Filters;
}

// ─── Main Page ────────────────────────────────────────────

export default function WorksTrashed({ works, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [restoringId, setRestoringId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const applySearch = () => {
        router.get(route('admin.works.trashed'), search ? { search } : {}, { preserveState: true });
    };

    const handleRestore = (work: Work) => {
        if (!confirm(`Kembalikan karya "${work.title}"?`)) return;
        setRestoringId(work.id);
        router.post(route('admin.works.restore', work.id), {}, {
            onFinish: () => setRestoringId(null),
        });
    };

    const handleForceDelete = (work: Work) => {
        if (!confirm(`PERINGATAN: Hapus PERMANEN "${work.title}"? File PDF juga akan dihapus dan tidak bisa dipulihkan.`)) return;
        setDeletingId(work.id);
        router.delete(route('admin.works.force-delete', work.id), {
            onFinish: () => setDeletingId(null),
        });
    };

    const formatDate = (dateStr: string | null) =>
        dateStr
            ? new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—';

    return (
        <AppLayout header={<h1 className="font-bold">Karya Terhapus</h1>}>
            <Head title="Karya Terhapus (Trash) - Repository KTI" />

            {/* ─── Header ─────────────────────────────────── */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link
                            href={route('admin.works.index')}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Semua Karya
                        </Link>
                        <span>/</span>
                        <span className="font-medium text-foreground">Terhapus</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Karya Terhapus</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Total <span className="font-semibold text-foreground">{works.total}</span> karya dalam trash
                    </p>
                </div>
            </div>

            {/* ─── Warning Banner ──────────────────────────── */}
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-700 dark:text-yellow-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                    <p className="font-semibold">Zona Berbahaya</p>
                    <p className="mt-0.5 text-xs opacity-90">
                        Karya di sini sudah di-soft delete. Gunakan <strong>Pulihkan</strong> untuk mengembalikan, atau{' '}
                        <strong>Hapus Permanen</strong> untuk menghapus beserta file PDF-nya selamanya.
                    </p>
                </div>
            </div>

            {/* ─── Search ─────────────────────────────────── */}
            <div className="mb-6 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        id="input-search-trashed"
                        type="text"
                        placeholder="Cari judul karya..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                        className="w-full rounded-lg border border-input bg-background py-2 pr-4 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    {search && (
                        <button
                            onClick={() => { setSearch(''); router.get(route('admin.works.trashed'), {}, { preserveState: true }); }}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
                <Button onClick={applySearch} variant="outline" className="gap-2">
                    <Search className="h-4 w-4" /> Cari
                </Button>
            </div>

            {/* ─── Table ──────────────────────────────────── */}
            <div className="overflow-hidden rounded-xl border border-destructive/10 bg-card text-card-foreground shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-destructive/5">
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Judul Karya</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">Penulis</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground lg:table-cell">Kategori</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Dihapus</th>
                                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {works.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center">
                                        <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                                        <p className="font-medium text-muted-foreground">Trash kosong</p>
                                        <p className="mt-1 text-xs text-muted-foreground">Tidak ada karya yang dihapus</p>
                                    </td>
                                </tr>
                            ) : (
                                works.data.map((work) => (
                                    <tr key={work.id} className="bg-destructive/5 transition-colors hover:bg-destructive/10">
                                        {/* Judul */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-start gap-2">
                                                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-destructive/40" />
                                                <div>
                                                    <p className="line-clamp-2 font-medium text-foreground">{work.title}</p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {work.year} · {work.department?.name ?? '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Penulis */}
                                        <td className="hidden px-4 py-3 md:table-cell">
                                            <span className="text-foreground/80">{work.author?.name ?? '—'}</span>
                                        </td>

                                        {/* Kategori */}
                                        <td className="hidden px-4 py-3 lg:table-cell">
                                            <span className="text-muted-foreground">{work.category?.name ?? '—'}</span>
                                        </td>

                                        {/* Dihapus */}
                                        <td className="px-4 py-3">
                                            <span className="text-xs text-destructive font-medium">{formatDate(work.deleted_at)}</span>
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Pulihkan */}
                                                <Button
                                                    id={`btn-restore-work-${work.id}`}
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1.5 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10"
                                                    onClick={() => handleRestore(work)}
                                                    disabled={restoringId === work.id}
                                                >
                                                    <RotateCcw className="h-3.5 w-3.5" />
                                                    {restoringId === work.id ? 'Memulihkan...' : 'Pulihkan'}
                                                </Button>

                                                {/* Hapus Permanen */}
                                                <Button
                                                    id={`btn-force-delete-work-${work.id}`}
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1.5 border-destructive/20 text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleForceDelete(work)}
                                                    disabled={deletingId === work.id}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    {deletingId === work.id ? 'Menghapus...' : 'Hapus Permanen'}
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
                {works.last_page > 1 && (
                    <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
                        <p className="text-xs text-muted-foreground">
                            {works.from && works.to
                                ? `Menampilkan ${works.from}–${works.to} dari ${works.total} karya`
                                : `Total ${works.total} karya`}
                        </p>
                        <div className="flex gap-1">
                            {works.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    preserveScroll
                                    className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground'
                                            : link.url
                                              ? 'border border-input bg-background text-foreground hover:bg-muted'
                                              : 'cursor-not-allowed border-transparent text-muted-foreground/50'
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
