// File: resources/js/pages/admin/reports/index.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { WorkStatus } from '@/types/work';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart3,
    BookOpen,
    Building2,
    FileText,
    GraduationCap,
    Layers,
    Shield,
    TrendingUp,
    UserCog,
    Users,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────

interface Stats {
    totalUsers: number;
    totalWorks: number;
    publishedWorks: number;
    pendingReviews: number;
    totalDepartments: number;
    totalCategories: number;
}

interface NameCount {
    name: string;
    count: number;
}

interface RecentWork {
    id: number;
    title: string;
    status: WorkStatus;
    created_at: string;
    author?: { id: number; name: string } | null;
    category?: { id: number; name: string } | null;
}

interface Props {
    stats: Stats;
    worksByStatus: Record<string, number>;
    worksByCategory: NameCount[];
    worksByDepartment: NameCount[];
    usersByRole: Record<string, number>;
    recentWorks: RecentWork[];
}

// ─── Status Config ────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    draft:          { label: 'Draft',           className: 'bg-muted text-muted-foreground border-border' },
    pending_review: { label: 'Menunggu Review', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
    in_review:      { label: 'Sedang Direview', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    revision:       { label: 'Revisi',          className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    approved:       { label: 'Disetujui',       className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    published:      { label: 'Dipublikasi',     className: 'bg-green-500/10 text-green-600 border-green-500/20' },
    rejected:       { label: 'Ditolak',         className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const ROLE_CONFIG: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
    admin:    { label: 'Admin',     icon: <Shield className="h-4 w-4" />,         className: 'text-purple-600 bg-purple-500/10 border-purple-500/20' },
    lecturer: { label: 'Dosen',     icon: <UserCog className="h-4 w-4" />,        className: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
    student:  { label: 'Mahasiswa', icon: <GraduationCap className="h-4 w-4" />,  className: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
};

// ─── Bar Chart (CSS-only) ─────────────────────────────────

function SimpleBar({ items, colorClass }: { items: NameCount[]; colorClass: string }) {
    const maxCount = Math.max(...items.map((i) => i.count), 1);

    if (items.length === 0) {
        return <p className="py-4 text-center text-sm text-muted-foreground">Belum ada data</p>;
    }

    return (
        <div className="space-y-2.5">
            {items.map((item) => (
                <div key={item.name} className="group">
                    <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="truncate font-medium text-foreground/80">{item.name}</span>
                        <span className="ml-2 shrink-0 font-bold text-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────

export default function ReportsIndex({
    stats,
    worksByStatus,
    worksByCategory,
    worksByDepartment,
    usersByRole,
    recentWorks,
}: Props) {
    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <AppLayout header={<h1 className="font-bold">Laporan & Statistik</h1>}>
            <Head title="Laporan - Repository KTI" />

            {/* ─── Header ─────────────────────────────────── */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Laporan & Statistik</h1>
                <p className="mt-1 text-sm text-muted-foreground">Ringkasan data keseluruhan sistem repository KTI</p>
            </div>

            {/* ─── Summary Cards ───────────────────────────── */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Users */}
                <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                        <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                        <p className="text-xs font-medium text-muted-foreground">Total Pengguna</p>
                    </div>
                </div>

                {/* Total Works */}
                <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{stats.totalWorks}</p>
                        <p className="text-xs font-medium text-muted-foreground">Total Karya</p>
                    </div>
                </div>

                {/* Published */}
                <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{stats.publishedWorks}</p>
                        <p className="text-xs font-medium text-muted-foreground">Dipublikasi</p>
                    </div>
                </div>

                {/* Pending Reviews */}
                <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{stats.pendingReviews}</p>
                        <p className="text-xs font-medium text-muted-foreground">Menunggu Review</p>
                    </div>
                </div>

                {/* Departments */}
                <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{stats.totalDepartments}</p>
                        <p className="text-xs font-medium text-muted-foreground">Program Studi</p>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pink-500/10">
                        <Layers className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{stats.totalCategories}</p>
                        <p className="text-xs font-medium text-muted-foreground">Kategori Karya</p>
                    </div>
                </div>
            </div>

            {/* ─── Charts Row 1: Status + Role ──────────────── */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                {/* Works by Status */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        Karya berdasarkan Status
                    </h2>
                    <div className="space-y-2">
                        {Object.entries(worksByStatus).length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">Belum ada data</p>
                        ) : (
                            Object.entries(worksByStatus).map(([status, count]) => {
                                const cfg = STATUS_CONFIG[status] ?? { label: status, className: 'bg-muted text-muted-foreground border-border' };
                                return (
                                    <div key={status} className="flex items-center justify-between rounded-lg border px-3 py-2 transition-colors hover:bg-muted/30">
                                        <div className="flex items-center gap-2">
                                            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border", cfg.className)}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-foreground">{count}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Users by Role */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
                        <Users className="h-4 w-4 text-primary" />
                        Pengguna berdasarkan Role
                    </h2>
                    <div className="space-y-3">
                        {Object.entries(usersByRole).length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">Belum ada data</p>
                        ) : (
                            Object.entries(usersByRole).map(([role, count]) => {
                                const cfg = ROLE_CONFIG[role] ?? { label: role, icon: <Users className="h-4 w-4" />, className: 'bg-muted text-muted-foreground border-border' };
                                return (
                                    <div key={role} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/30">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", cfg.className)}>
                                                {cfg.icon}
                                            </div>
                                            <span className="text-sm font-semibold text-foreground/80">{cfg.label}</span>
                                        </div>
                                        <span className="text-lg font-bold text-foreground">{count}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Charts Row 2: Category + Department ──────── */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                {/* Works by Category */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
                        <Layers className="h-4 w-4 text-pink-600" />
                        Karya berdasarkan Kategori
                    </h2>
                    <SimpleBar items={worksByCategory} colorClass="bg-pink-500" />
                </div>

                {/* Works by Department */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
                        <Building2 className="h-4 w-4 text-indigo-600" />
                        Karya berdasarkan Departemen
                    </h2>
                    <SimpleBar items={worksByDepartment} colorClass="bg-indigo-500" />
                </div>
            </div>

            {/* ─── Recent Works ─────────────────────────────── */}
            <div className="rounded-xl border bg-card p-6 shadow-sm overflow-hidden">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                        <FileText className="h-4 w-4 text-primary" />
                        Karya Terbaru
                    </h2>
                    <Link href={route('admin.works.index')}>
                        <Button variant="outline" size="sm" className="text-xs">
                            Lihat Semua →
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">Judul</th>
                                <th className="hidden px-3 py-2.5 text-left font-semibold text-muted-foreground md:table-cell">Penulis</th>
                                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">Status</th>
                                <th className="hidden px-3 py-2.5 text-left font-semibold text-muted-foreground lg:table-cell">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {recentWorks.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-3 py-12 text-center text-muted-foreground">
                                        <BookOpen className="mx-auto mb-2 h-8 w-8 opacity-20" />
                                        <p>Belum ada karya</p>
                                    </td>
                                </tr>
                            ) : (
                                recentWorks.map((work) => {
                                    const statusCfg = STATUS_CONFIG[work.status] ?? { label: work.status, className: 'bg-muted text-muted-foreground border-border' };
                                    return (
                                        <tr key={work.id} className="transition-colors hover:bg-muted/30">
                                            <td className="px-3 py-3">
                                                <Link
                                                    href={route('admin.works.show', work.id)}
                                                    className="line-clamp-1 font-medium text-foreground hover:text-primary transition-colors"
                                                >
                                                    {work.title}
                                                </Link>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{work.category?.name ?? '—'}</p>
                                            </td>
                                            <td className="hidden px-3 py-3 text-foreground/70 md:table-cell">
                                                {work.author?.name ?? '—'}
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border", statusCfg.className)}>
                                                    {statusCfg.label}
                                                </span>
                                            </td>
                                            <td className="hidden px-3 py-3 text-xs text-muted-foreground lg:table-cell">
                                                {formatDate(work.created_at)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

// Helper to handle conditional classNames
function cn(...classes: (string | undefined | boolean)[]) {
    return classes.filter(Boolean).join(' ');
}
