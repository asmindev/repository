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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    draft:          { label: 'Draft',           color: 'text-gray-600',    bg: 'bg-gray-100' },
    pending_review: { label: 'Menunggu Review', color: 'text-yellow-700',  bg: 'bg-yellow-100' },
    in_review:      { label: 'Sedang Direview', color: 'text-blue-700',    bg: 'bg-blue-100' },
    revision:       { label: 'Revisi',          color: 'text-orange-700',  bg: 'bg-orange-100' },
    approved:       { label: 'Disetujui',       color: 'text-emerald-700', bg: 'bg-emerald-100' },
    published:      { label: 'Dipublikasi',     color: 'text-green-700',   bg: 'bg-green-100' },
    rejected:       { label: 'Ditolak',         color: 'text-red-700',     bg: 'bg-red-100' },
};

const ROLE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    admin:    { label: 'Admin',     icon: <Shield className="h-4 w-4" />,         color: 'text-purple-600 bg-purple-100' },
    lecturer: { label: 'Dosen',     icon: <UserCog className="h-4 w-4" />,        color: 'text-blue-600 bg-blue-100' },
    student:  { label: 'Mahasiswa', icon: <GraduationCap className="h-4 w-4" />,  color: 'text-emerald-600 bg-emerald-100' },
};

// ─── Bar Chart (CSS-only) ─────────────────────────────────

function SimpleBar({ items, colorClass }: { items: NameCount[]; colorClass: string }) {
    const maxCount = Math.max(...items.map((i) => i.count), 1);

    if (items.length === 0) {
        return <p className="py-4 text-center text-sm text-gray-400">Belum ada data</p>;
    }

    return (
        <div className="space-y-2.5">
            {items.map((item) => (
                <div key={item.name} className="group">
                    <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="truncate font-medium text-gray-700">{item.name}</span>
                        <span className="ml-2 shrink-0 font-bold text-gray-900">{item.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
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
        <AppLayout title="Laporan & Statistik">
            <Head title="Laporan - Repository KTI" />

            {/* ─── Header ─────────────────────────────────── */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Laporan & Statistik</h1>
                <p className="mt-1 text-sm text-gray-500">Ringkasan data keseluruhan sistem repository KTI</p>
            </div>

            {/* ─── Summary Cards ───────────────────────────── */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Users */}
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                        <p className="text-xs font-medium text-gray-500">Total Pengguna</p>
                    </div>
                </div>

                {/* Total Works */}
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalWorks}</p>
                        <p className="text-xs font-medium text-gray-500">Total Karya</p>
                    </div>
                </div>

                {/* Published */}
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.publishedWorks}</p>
                        <p className="text-xs font-medium text-gray-500">Dipublikasi</p>
                    </div>
                </div>

                {/* Pending Reviews */}
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-yellow-100">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
                        <p className="text-xs font-medium text-gray-500">Menunggu Review</p>
                    </div>
                </div>

                {/* Departments */}
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalDepartments}</p>
                        <p className="text-xs font-medium text-gray-500">Program Studi</p>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pink-100">
                        <Layers className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
                        <p className="text-xs font-medium text-gray-500">Kategori Karya</p>
                    </div>
                </div>
            </div>

            {/* ─── Charts Row 1: Status + Role ──────────────── */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                {/* Works by Status */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        Karya berdasarkan Status
                    </h2>
                    <div className="space-y-2">
                        {Object.entries(worksByStatus).length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-400">Belum ada data</p>
                        ) : (
                            Object.entries(worksByStatus).map(([status, count]) => {
                                const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'text-gray-600', bg: 'bg-gray-100' };
                                return (
                                    <div key={status} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-block h-2.5 w-2.5 rounded-full ${cfg.bg}`} />
                                            <span className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{count}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Users by Role */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                        <Users className="h-4 w-4 text-purple-600" />
                        Pengguna berdasarkan Role
                    </h2>
                    <div className="space-y-3">
                        {Object.entries(usersByRole).length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-400">Belum ada data</p>
                        ) : (
                            Object.entries(usersByRole).map(([role, count]) => {
                                const cfg = ROLE_CONFIG[role] ?? { label: role, icon: <Users className="h-4 w-4" />, color: 'text-gray-600 bg-gray-100' };
                                return (
                                    <div key={role} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cfg.color}`}>
                                                {cfg.icon}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700">{cfg.label}</span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-900">{count}</span>
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
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                        <Layers className="h-4 w-4 text-pink-600" />
                        Karya berdasarkan Kategori
                    </h2>
                    <SimpleBar items={worksByCategory} colorClass="bg-pink-500" />
                </div>

                {/* Works by Department */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                        <Building2 className="h-4 w-4 text-indigo-600" />
                        Karya berdasarkan Departemen
                    </h2>
                    <SimpleBar items={worksByDepartment} colorClass="bg-indigo-500" />
                </div>
            </div>

            {/* ─── Recent Works ─────────────────────────────── */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                        <FileText className="h-4 w-4 text-blue-600" />
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
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-3 py-2 text-left font-semibold text-gray-600">Judul</th>
                                <th className="hidden px-3 py-2 text-left font-semibold text-gray-600 md:table-cell">Penulis</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-600">Status</th>
                                <th className="hidden px-3 py-2 text-left font-semibold text-gray-600 lg:table-cell">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentWorks.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-3 py-8 text-center text-gray-400">Belum ada karya</td>
                                </tr>
                            ) : (
                                recentWorks.map((work) => {
                                    const statusCfg = STATUS_CONFIG[work.status] ?? { label: work.status, color: 'text-gray-600', bg: 'bg-gray-100' };
                                    return (
                                        <tr key={work.id} className="transition-colors hover:bg-gray-50">
                                            <td className="px-3 py-2.5">
                                                <Link
                                                    href={route('admin.works.show', work.id)}
                                                    className="line-clamp-1 font-medium text-gray-900 hover:text-blue-600"
                                                >
                                                    {work.title}
                                                </Link>
                                                <p className="text-xs text-gray-400">{work.category?.name ?? '—'}</p>
                                            </td>
                                            <td className="hidden px-3 py-2.5 text-gray-600 md:table-cell">
                                                {work.author?.name ?? '—'}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.bg} ${statusCfg.color}`}>
                                                    {statusCfg.label}
                                                </span>
                                            </td>
                                            <td className="hidden px-3 py-2.5 text-xs text-gray-500 lg:table-cell">
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
