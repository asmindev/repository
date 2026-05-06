// File: resources/js/pages/admin/works/index.tsx

import AppLayout from '@/components/layouts/app-layout';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaginationNav } from '@/components/ui/pagination-nav';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Department } from '@/types/department';
import type { Work, WorkStatus } from '@/types/work';
import type { WorkCategory } from '@/types/work-category';
import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle2,
    Eye,
    FileText,
    Filter,
    Globe,
    Lock,
    MoreHorizontal,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    X,
    XCircle,
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
    draft: { label: 'Draft', className: 'bg-muted text-muted-foreground border-border' },
    pending_review: { label: 'Menunggu Review', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
    in_review: { label: 'Sedang Direview', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    revision: { label: 'Revisi', className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    approved: { label: 'Disetujui', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    published: { label: 'Dipublikasi', className: 'bg-green-500/10 text-green-600 border-green-500/20' },
    rejected: { label: 'Ditolak', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

function StatusBadge({ status }: { status: WorkStatus }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status, className: 'bg-muted text-muted-foreground' };
    return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.className}`}>{cfg.label}</span>;
}

// ─── Visibility Badge ─────────────────────────────────────

function VisibilityBadge({ visibility }: { visibility: string }) {
    return visibility === 'public' ? (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
            <Globe className="h-3 w-3" /> Publik
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Terbatas
        </span>
    );
}

// ─── Main Page ────────────────────────────────────────────

export default function WorksIndex({ works, filters, categories, departments }: Props) {
    console.log(works.data);
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [categoryId, setCategoryId] = useState(filters.category_id ?? '');
    const [departmentId, setDepartmentId] = useState(filters.department_id ?? '');
    const [showFilters, setShowFilters] = useState(!!(filters.status || filters.category_id || filters.department_id));
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [publishingId, setPublishingId] = useState<number | null>(null);
    const [workToDelete, setWorkToDelete] = useState<Work | null>(null);
    const [workToPublish, setWorkToPublish] = useState<Work | null>(null);

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

    const confirmDelete = () => {
        if (!workToDelete) return;
        setDeletingId(workToDelete.id);
        router.delete(route('admin.works.destroy', workToDelete.id), {
            onFinish: () => {
                setDeletingId(null);
                setWorkToDelete(null);
            },
        });
    };

    const confirmPublish = () => {
        if (!workToPublish) return;
        setPublishingId(workToPublish.id);
        router.post(
            route('admin.works.publish', workToPublish.id),
            {},
            {
                onFinish: () => {
                    setPublishingId(null);
                    setWorkToPublish(null);
                },
            },
        );
    };

    const handleUpdateStatus = (id: number, newStatus: string) => {
        router.patch(
            route('admin.works.change-status', id),
            { status: newStatus },
            {
                preserveScroll: true,
            },
        );
    };

    const formatDate = (dateStr: string | null) =>
        dateStr ? new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    const formatSize = (bytes: number | null) => {
        if (!bytes) return '—';
        return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
    };

    return (
        <AppLayout header={<h1 className="font-bold">Semua Dokumen</h1>}>
            <Head title="Semua Karya - Repository KTI" />

            {/* ─── Header ─────────────────────────────────── */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Semua Dokumen</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Total <span className="font-semibold text-foreground">{works.total}</span> dokumen terdaftar
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href={route('admin.works.create')}>
                        <Button id="btn-tambah-karya" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Dokumen
                        </Button>
                    </Link>
                    {/* hide button trashed disabled for now*/}
                    {/* <Link href={route('admin.works.trashed')}>
                        <Button variant="outline" className="gap-2 border-destructive/20 text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                            Terhapus
                        </Button>
                    </Link> */}
                </div>
            </div>

            {/* ─── Search & Filter Bar ─────────────────────── */}
            <div className="mb-6 space-y-3">
                {/* Search Row */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            id="input-search-works"
                            type="text"
                            placeholder="Cari judul karya atau nama penulis..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
                            className="w-full rounded-lg border border-input bg-background py-2 pr-4 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        {search && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    applyFilters({ search: '' });
                                }}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
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
                        className={`gap-2 ${activeFilterCount > 0 ? 'border-primary/30 bg-primary/10 text-primary' : ''}`}
                    >
                        <Filter className="h-4 w-4" />
                        Filter
                        {activeFilterCount > 0 && (
                            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="rounded-lg border bg-muted/50 p-4">
                        <div className="grid gap-3 sm:grid-cols-3">
                            {/* Status */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                                <select
                                    id="filter-status"
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        applyFilters({ status: e.target.value });
                                    }}
                                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="">Semua Status</option>
                                    {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                                        <option key={val} value={val}>
                                            {cfg.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Kategori */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">Kategori</label>
                                <select
                                    id="filter-category"
                                    value={categoryId}
                                    onChange={(e) => {
                                        setCategoryId(e.target.value);
                                        applyFilters({ category_id: e.target.value });
                                    }}
                                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="">Semua Kategori</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Departemen */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">Departemen</label>
                                <select
                                    id="filter-department"
                                    value={departmentId}
                                    onChange={(e) => {
                                        setDepartmentId(e.target.value);
                                        applyFilters({ department_id: e.target.value });
                                    }}
                                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="">Semua Departemen</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={resetFilters}
                                className="mt-3 flex items-center gap-1.5 text-xs text-destructive transition-colors hover:text-destructive/80"
                            >
                                <X className="h-3 w-3" /> Reset semua filter
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ─── Table ──────────────────────────────────── */}
            <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-semibold text-muted-foreground">Judul Dokumen</TableHead>
                                <TableHead className="hidden font-semibold text-muted-foreground md:table-cell">Penulis</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                                <TableHead className="hidden font-semibold text-muted-foreground lg:table-cell">Visibilitas</TableHead>
                                <TableHead className="hidden font-semibold text-muted-foreground xl:table-cell">Tahun</TableHead>
                                <TableHead className="hidden font-semibold text-muted-foreground xl:table-cell">Ukuran</TableHead>
                                <TableHead className="text-center font-semibold text-muted-foreground">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y">
                            {works.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-16 text-center">
                                        <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                                        <p className="font-medium text-muted-foreground">Tidak ada karya ditemukan</p>
                                        {activeFilterCount > 0 && (
                                            <button onClick={resetFilters} className="mt-2 text-xs text-primary hover:underline">
                                                Reset filter
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                works.data.map((work) => (
                                    <TableRow key={work.id} className="transition-colors hover:bg-muted/30">
                                        {/* Judul */}
                                        <TableCell>
                                            <div className="flex max-w-40 items-start gap-2">
                                                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                                                <div className="min-w-0">
                                                    <Link
                                                        href={route('admin.works.show', work.id)}
                                                        className="block truncate font-medium text-foreground transition-colors hover:text-primary"
                                                        title={work.title}
                                                    >
                                                        {work.title}
                                                    </Link>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {work.category?.name ?? '—'} · {work.department?.name ?? '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Penulis */}
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-7 w-7 border shadow-sm">
                                                    {work.author?.name && (
                                                        <AvatarImage
                                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(work.author.name)}&background=random`}
                                                            alt={work.author.name}
                                                        />
                                                    )}
                                                    <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
                                                        {work.author?.name?.charAt(0).toUpperCase() ?? '?'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="truncate text-foreground/80">{work.author?.name ?? '—'}</span>
                                            </div>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <StatusBadge status={work.status} />
                                        </TableCell>

                                        {/* Visibilitas */}
                                        <TableCell className="hidden lg:table-cell">
                                            <VisibilityBadge visibility={work.visibility} />
                                        </TableCell>
                                        {/* year */}
                                        <TableCell className="hidden lg:table-cell">{formatDate(work.created_at)}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{formatSize(work.full_file_size)}</TableCell>

                                        <TableCell className="flex items-center justify-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Menu aksi</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />

                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('admin.works.show', work.id)} className="flex w-full items-center">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Lihat Detail
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route('admin.works.edit', work.id)}
                                                            className="flex w-full items-center"
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit Dokumen
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route('admin.works.chapters.index', work.id)}
                                                            className="flex w-full items-center"
                                                        >
                                                            <BookOpen className="mr-2 h-4 w-4" />
                                                            Kelola Bab
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    {work.status === 'published' ? (
                                                        <DropdownMenuItem
                                                            onClick={() => handleUpdateStatus(work.id, 'approved')}
                                                            className="cursor-pointer text-orange-600 focus:bg-orange-50 focus:text-orange-600 dark:text-orange-400 dark:focus:bg-orange-900/20 dark:focus:text-orange-400"
                                                        >
                                                            <RotateCcw className="mr-2 h-4 w-4" />
                                                            Batalkan Publikasi
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => handleUpdateStatus(work.id, 'published')}
                                                                className="cursor-pointer text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600 dark:text-emerald-400 dark:focus:bg-emerald-900/20 dark:focus:text-emerald-400"
                                                            >
                                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                Terima & Publikasi
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleUpdateStatus(work.id, 'rejected')}
                                                                className="text-destructive focus:bg-destructive/5 focus:text-destructive"
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Tolak Karya
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}

                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => setWorkToDelete(work)}
                                                        disabled={deletingId === work.id}
                                                        className="text-destructive focus:bg-destructive/5 focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Hapus Karya
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <PaginationNav links={works.links} from={works.from} to={works.to} total={works.total} />
            </div>

            {/* Dialog Hapus Karya */}
            <AlertDialog open={workToDelete !== null} onOpenChange={(open) => !open && setWorkToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus karya <strong>"{workToDelete?.title}"</strong>? Karya ini akan dipindahkan ke folder
                            Terhapus dan masih bisa dikembalikan nanti.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                confirmDelete();
                            }}
                            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Dialog Publikasi Karya */}
            <AlertDialog open={workToPublish !== null} onOpenChange={(open) => !open && setWorkToPublish(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Publikasikan Karya</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin mempublikasikan karya <strong>"{workToPublish?.title}"</strong>? Karya ini akan dapat diakses oleh
                            publik.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                confirmPublish();
                            }}
                            className="bg-green-600 text-white hover:bg-green-700 focus:ring-green-600"
                        >
                            Publikasikan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
