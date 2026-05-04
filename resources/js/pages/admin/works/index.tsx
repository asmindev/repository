// File: resources/js/pages/admin/works/index.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { Department } from '@/types/department';
import type { Work, WorkStatus } from '@/types/work';
import type { WorkCategory } from '@/types/work-category';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    Eye,
    FileText,
    Filter,
    Globe,
    Lock,
    RotateCcw,
    Search,
    Send,
    Trash2,
    TrendingUp,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    status?: string;
    category_id?: string;
    department_id?: string;
}

interface Props {
    works: PaginatedWorks;
    filters: Filters;
    categories: Pick<WorkCategory, 'id' | 'name'>[];
    departments: Pick<Department, 'id' | 'name'>[];
}

// ─── Status Config ────────────────────────────────────────

const STATUS_CONFIG: Record<WorkStatus, { label: string; className: string }> = {
    draft:          { label: 'Draft',           className: 'bg-gray-100 text-gray-600 border-gray-200' },
    pending_review: { label: 'Menunggu Review', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    in_review:      { label: 'Sedang Direview', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    revision:       { label: 'Revisi',          className: 'bg-orange-100 text-orange-700 border-orange-200' },
    approved:       { label: 'Disetujui',       className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    published:      { label: 'Dipublikasi',     className: 'bg-green-100 text-green-700 border-green-200' },
    rejected:       { label: 'Ditolak',         className: 'bg-red-100 text-red-700 border-red-200' },
};

function StatusBadge({ status }: { status: WorkStatus }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' };
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.className}`}>
            {cfg.label}
        </span>
    );
}

// ─── Visibility Badge ─────────────────────────────────────

function VisibilityBadge({ visibility }: { visibility: string }) {
    return visibility === 'public' ? (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
            <Globe className="h-3 w-3" /> Publik
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
            <Lock className="h-3 w-3" /> Terbatas
        </span>
    );
}

// ─── Main Page ────────────────────────────────────────────

export default function WorksIndex({ works, filters, categories, departments }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [categoryId, setCategoryId] = useState(filters.category_id ?? '');
    const [departmentId, setDepartmentId] = useState(filters.department_id ?? '');
    const [showFilters, setShowFilters] = useState(!!(filters.status || filters.category_id || filters.department_id));
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [publishingId, setPublishingId] = useState<number | null>(null);

    const activeFilterCount = [filters.status, filters.category_id, filters.department_id].filter(Boolean).length;

    const applyFilters = (overrides: Partial<Filters> = {}) => {
        const params: Record<string, string> = {};
        const s = overrides.search !== undefined ? overrides.search : search;
        const st = overrides.status !== undefined ? overrides.status : status;
        const cat = overrides.category_id !== undefined ? overrides.category_id : categoryId;
        const dept = overrides.department_id !== undefined ? overrides.department_id : departmentId;

        if (s) params.search = s;
        if (st) params.status = st;
        if (cat) params.category_id = cat;
        if (dept) params.department_id = dept;

        router.get(route('admin.works.index'), params, { preserveState: true });
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('');
        setCategoryId('');
        setDepartmentId('');
        router.get(route('admin.works.index'), {}, { preserveState: true });
    };

    const handleDelete = (work: Work) => {
        if (!confirm(`Yakin ingin menghapus "${work.title}"? Karya bisa dikembalikan nanti.`)) return;
        setDeletingId(work.id);
        router.delete(route('admin.works.destroy', work.id), {
            onFinish: () => setDeletingId(null),
        });
    };

    const handlePublish = (work: Work) => {
        if (!confirm(`Publikasikan "${work.title}"? Karya akan dapat diakses publik.`)) return;
        setPublishingId(work.id);
        router.post(route('admin.works.publish', work.id), {}, {
            onFinish: () => setPublishingId(null),
        });
    };

    const formatDate = (dateStr: string | null) =>
        dateStr ? new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    const formatSize = (bytes: number | null) => {
        if (!bytes) return '—';
        return bytes >= 1024 * 1024
            ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
            : `${(bytes / 1024).toFixed(0)} KB`;
    };

    return (
        <AppLayout title="Semua Karya">
            <Head title="Semua Karya - Repository KTI" />

            {/* ─── Header ─────────────────────────────────── */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Semua Karya</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Total <span className="font-semibold text-gray-700">{works.total}</span> karya terdaftar
                    </p>
                </div>
                <Link href={route('admin.works.trashed')}>
                    <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                        Lihat Terhapus
                    </Button>
                </Link>
            </div>

            {/* ─── Search & Filter Bar ─────────────────────── */}
            <div className="mb-6 space-y-3">
                {/* Search Row */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            id="input-search-works"
                            type="text"
                            placeholder="Cari judul karya atau nama penulis..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
                            className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        {search && (
                            <button onClick={() => { setSearch(''); applyFilters({ search: '' }); }}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                    <Button onClick={() => applyFilters()} variant="outline" className="gap-2">
                        <Search className="h-4 w-4" /> Cari
                    </Button>
                    <Button
                        id="btn-toggle-filters"
                        onClick={() => setShowFilters((v) => !v)}
                        variant="outline"
                        className={`gap-2 ${activeFilterCount > 0 ? 'border-blue-300 bg-blue-50 text-blue-700' : ''}`}
                    >
                        <Filter className="h-4 w-4" />
                        Filter
                        {activeFilterCount > 0 && (
                            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="grid gap-3 sm:grid-cols-3">
                            {/* Status */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
                                <select
                                    id="filter-status"
                                    value={status}
                                    onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                                    className="w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-700 outline-none focus:border-blue-500"
                                >
                                    <option value="">Semua Status</option>
                                    {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                                        <option key={val} value={val}>{cfg.label}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Kategori */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Kategori</label>
                                <select
                                    id="filter-category"
                                    value={categoryId}
                                    onChange={(e) => { setCategoryId(e.target.value); applyFilters({ category_id: e.target.value }); }}
                                    className="w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-700 outline-none focus:border-blue-500"
                                >
                                    <option value="">Semua Kategori</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Departemen */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Departemen</label>
                                <select
                                    id="filter-department"
                                    value={departmentId}
                                    onChange={(e) => { setDepartmentId(e.target.value); applyFilters({ department_id: e.target.value }); }}
                                    className="w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-700 outline-none focus:border-blue-500"
                                >
                                    <option value="">Semua Departemen</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {activeFilterCount > 0 && (
                            <button onClick={resetFilters} className="mt-3 flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700">
                                <X className="h-3 w-3" /> Reset semua filter
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ─── Table ──────────────────────────────────── */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Judul Karya</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 md:table-cell">Penulis</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 lg:table-cell">Visibilitas</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 xl:table-cell">Tahun</th>
                                <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 xl:table-cell">Ukuran</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {works.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-16 text-center">
                                        <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                                        <p className="font-medium text-gray-400">Tidak ada karya ditemukan</p>
                                        {activeFilterCount > 0 && (
                                            <button onClick={resetFilters} className="mt-2 text-xs text-blue-600 hover:underline">
                                                Reset filter
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                works.data.map((work) => (
                                    <tr key={work.id} className="transition-colors hover:bg-gray-50">
                                        {/* Judul */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-start gap-2">
                                                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                                <div className="min-w-0">
                                                    <Link
                                                        href={route('admin.works.show', work.id)}
                                                        className="line-clamp-2 font-medium text-gray-900 hover:text-blue-600"
                                                    >
                                                        {work.title}
                                                    </Link>
                                                    <p className="mt-0.5 text-xs text-gray-500">
                                                        {work.category?.name ?? '—'} · {work.department?.name ?? '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Penulis */}
                                        <td className="hidden px-4 py-3 md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-[10px] font-bold text-white">
                                                    {work.author?.name?.charAt(0).toUpperCase() ?? '?'}
                                                </div>
                                                <span className="truncate text-gray-700">{work.author?.name ?? '—'}</span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <StatusBadge status={work.status} />
                                        </td>

                                        {/* Visibilitas */}
                                        <td className="hidden px-4 py-3 lg:table-cell">
                                            <VisibilityBadge visibility={work.visibility} />
                                        </td>

                                        {/* Tahun */}
                                        <td className="hidden px-4 py-3 text-gray-600 xl:table-cell">
                                            {work.year}
                                        </td>

                                        {/* Ukuran */}
                                        <td className="hidden px-4 py-3 text-xs text-gray-500 xl:table-cell">
                                            {formatSize(work.full_file_size)}
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1.5">
                                                {/* Lihat Detail */}
                                                <Link href={route('admin.works.show', work.id)}>
                                                    <Button id={`btn-view-work-${work.id}`} variant="outline" size="sm" className="gap-1">
                                                        <Eye className="h-3.5 w-3.5" />
                                                        <span className="hidden sm:inline">Detail</span>
                                                    </Button>
                                                </Link>

                                                {/* Publikasi (hanya jika approved) */}
                                                {work.status === 'approved' && (
                                                    <Button
                                                        id={`btn-publish-work-${work.id}`}
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-1 border-green-200 text-green-700 hover:bg-green-50"
                                                        onClick={() => handlePublish(work)}
                                                        disabled={publishingId === work.id}
                                                    >
                                                        <TrendingUp className="h-3.5 w-3.5" />
                                                        <span className="hidden sm:inline">Publikasi</span>
                                                    </Button>
                                                )}

                                                {/* Hapus */}
                                                <Button
                                                    id={`btn-delete-work-${work.id}`}
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(work)}
                                                    disabled={deletingId === work.id}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
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
                    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-500">
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
