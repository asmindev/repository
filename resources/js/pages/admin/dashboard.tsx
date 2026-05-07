import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, BarChart3, BookOpen, FileText, TrendingUp, Users } from 'lucide-react';

interface Props {
    stats?: {
        totalUsers: number;
        totalWorks: number;
        publishedWorks: number;
        pendingReviews: number;
        totalDepartments: number;
        totalCategories: number;
    };
}

export default function AdminDashboard({ stats }: Props) {
    const defaultStats = {
        totalUsers: 0,
        totalWorks: 0,
        publishedWorks: 0,
        pendingReviews: 0,
        totalDepartments: 0,
        totalCategories: 0,
    };

    const data = stats || defaultStats;

    return (
        <AppLayout title="Dashboard Admin">
            <Head title="Dashboard Admin - Repository KTI" />

            {/* ─── Header ────────────────────────────────────────── */}
            <div className="mt-6 mb-8 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background p-2 shadow-md ring-1 ring-border">
                    <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Sistem</h1>
                    <p className="mt-1 text-muted-foreground">Pantau dan kelola repository karya tulis ilmiah</p>
                </div>
            </div>

            {/* ─── Stats Grid ────────────────────────────────────── */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Total Users */}
                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Pengguna</p>
                                <p className="mt-2 text-3xl font-bold text-foreground">{data.totalUsers}</p>
                                <p className="mt-2 text-xs text-muted-foreground">Mahasiswa, Dosen, Admin</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('admin.users.index')}
                        className="block border-t bg-muted/50 px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        Kelola Pengguna →
                    </Link>
                </div>

                {/* Total Works */}
                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Karya</p>
                                <p className="mt-2 text-3xl font-bold text-foreground">{data.totalWorks}</p>
                                <p className="mt-2 text-xs text-muted-foreground">Semua status</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                                <BookOpen className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('admin.works.index')}
                        className="block border-t bg-muted/50 px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        Lihat Semua Karya →
                    </Link>
                </div>

                {/* Published Works */}
                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Karya Dipublikasikan</p>
                                <p className="mt-2 text-3xl font-bold text-foreground">{data.publishedWorks}</p>
                                <p className="mt-2 text-xs text-muted-foreground">Publik & Terbatas</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="border-t bg-muted/50 px-6 py-3 text-sm font-medium text-muted-foreground">Terbit {new Date().getFullYear()}</div>
                </div>

                {/* Pending Reviews */}
                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Review Menunggu</p>
                                <p className="mt-2 text-3xl font-bold text-foreground">{data.pendingReviews}</p>
                                <p className="mt-2 text-xs text-muted-foreground">Perlu perhatian</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                                <AlertCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    {data.pendingReviews > 0 && (
                        <div className="border-t bg-yellow-500/10 px-6 py-3 text-sm font-medium text-yellow-600">
                            {data.pendingReviews} karya menunggu review
                        </div>
                    )}
                </div>

                {/* Departments */}
                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Program Studi</p>
                                <p className="mt-2 text-3xl font-bold text-foreground">{data.totalDepartments}</p>
                                <p className="mt-2 text-xs text-muted-foreground">Dari berbagai fakultas</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
                                <FileText className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('admin.departments.index')}
                        className="block border-t bg-muted/50 px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        Kelola Program Studi →
                    </Link>
                </div>

                {/* Categories */}
                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kategori Karya</p>
                                <p className="mt-2 text-3xl font-bold text-foreground">{data.totalCategories}</p>
                                <p className="mt-2 text-xs text-muted-foreground">Skripsi, KTI, Tesis</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10">
                                <BarChart3 className="h-6 w-6 text-pink-600" />
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('admin.work-categories.index')}
                        className="block border-t bg-muted/50 px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        Kelola Kategori →
                    </Link>
                </div>
            </div>

            {/* ─── Quick Actions ──────────────────────────────────── */}
            <div className="mb-8 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Aksi Cepat</h2>
                <div className="flex flex-wrap gap-3">
                    <Link href={route('admin.users.create')}>
                        <Button>
                            <Users className="mr-2 h-4 w-4" />
                            Tambah Pengguna
                        </Button>
                    </Link>
                    <Link href={route('admin.departments.create')}>
                        <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Tambah Program Studi
                        </Button>
                    </Link>
                    <Link href={route('admin.work-categories.create')}>
                        <Button variant="outline">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Tambah Kategori
                        </Button>
                    </Link>
                    <Link href={route('admin.reports.index')}>
                        <Button variant="outline">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Lihat Laporan
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ─── Recent Activity ────────────────────────────────── */}
            <div className="grid gap-8 md:grid-cols-2">
                {/* Management Links */}
                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">Manajemen Sistem</h2>
                    <div className="space-y-2">
                        <Link href={route('admin.users.index')} className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent">
                            <Users className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-foreground">Kelola Pengguna</span>
                        </Link>
                        <Link href={route('admin.works.index')} className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-foreground">Kelola Karya Tulis</span>
                        </Link>
                        <Link
                            href={route('admin.works.trashed')}
                            className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                        >
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <span className="text-sm font-medium text-foreground">Karya Dihapus</span>
                        </Link>
                        <Link
                            href={route('admin.departments.index')}
                            className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                        >
                            <FileText className="h-5 w-5 text-indigo-600" />
                            <span className="text-sm font-medium text-foreground">Kelola Program Studi</span>
                        </Link>
                        <Link
                            href={route('admin.work-categories.index')}
                            className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                        >
                            <BarChart3 className="h-5 w-5 text-pink-600" />
                            <span className="text-sm font-medium text-foreground">Kelola Kategori</span>
                        </Link>
                    </div>
                </div>

                {/* Reports */}
                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">Laporan & Analytics</h2>
                    <div className="space-y-2">
                        <Link
                            href={route('admin.reports.index')}
                            className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                        >
                            <BarChart3 className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-foreground">Laporan Umum</span>
                        </Link>
                        <Link
                            href={route('admin.reports.works')}
                            className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                        >
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-foreground">Statistik Karya</span>
                        </Link>
                        <Link
                            href={route('admin.reports.users')}
                            className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                        >
                            <Users className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-foreground">Statistik Pengguna</span>
                        </Link>
                        <button className="w-full rounded-lg p-3 text-left transition-colors hover:bg-accent">
                            <span className="text-sm font-medium text-foreground">📥 Ekspor Data</span>
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
