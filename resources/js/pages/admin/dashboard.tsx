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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Sistem</h1>
                <p className="mt-2 text-gray-600">Pantau dan kelola repository karya tulis ilmiah</p>
            </div>

            {/* ─── Stats Grid ────────────────────────────────────── */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Total Users */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalUsers}</p>
                                <p className="mt-2 text-xs text-gray-500">Mahasiswa, Dosen, Admin</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('admin.users.index')}
                        className="block border-t border-gray-200 bg-gray-50 px-6 py-3 text-sm font-medium text-blue-600 hover:bg-gray-100"
                    >
                        Kelola Pengguna →
                    </Link>
                </div>

                {/* Total Works */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Karya</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalWorks}</p>
                                <p className="mt-2 text-xs text-gray-500">Semua status</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                                <BookOpen className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('admin.works.index')}
                        className="block border-t border-gray-200 bg-gray-50 px-6 py-3 text-sm font-medium text-blue-600 hover:bg-gray-100"
                    >
                        Lihat Semua Karya →
                    </Link>
                </div>

                {/* Published Works */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Karya Dipublikasikan</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{data.publishedWorks}</p>
                                <p className="mt-2 text-xs text-gray-500">Publik & Terbatas</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-600">
                        Terbit {new Date().getFullYear()}
                    </div>
                </div>

                {/* Pending Reviews */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Review Menunggu</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{data.pendingReviews}</p>
                                <p className="mt-2 text-xs text-gray-500">Perlu perhatian</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                                <AlertCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    {data.pendingReviews > 0 && (
                        <div className="border-t border-gray-200 bg-yellow-50 px-6 py-3 text-sm font-medium text-yellow-700">
                            {data.pendingReviews} karya menunggu review
                        </div>
                    )}
                </div>

                {/* Departments */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Program Studi</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalDepartments}</p>
                                <p className="mt-2 text-xs text-gray-500">Dari berbagai fakultas</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                                <FileText className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('admin.departments.index')}
                        className="block border-t border-gray-200 bg-gray-50 px-6 py-3 text-sm font-medium text-blue-600 hover:bg-gray-100"
                    >
                        Kelola Program Studi →
                    </Link>
                </div>

                {/* Categories */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Kategori Karya</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalCategories}</p>
                                <p className="mt-2 text-xs text-gray-500">Skripsi, KTI, Tesis</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                                <BarChart3 className="h-6 w-6 text-pink-600" />
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('admin.work-categories.index')}
                        className="block border-t border-gray-200 bg-gray-50 px-6 py-3 text-sm font-medium text-blue-600 hover:bg-gray-100"
                    >
                        Kelola Kategori →
                    </Link>
                </div>
            </div>

            {/* ─── Quick Actions ──────────────────────────────────── */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Aksi Cepat</h2>
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
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Manajemen Sistem</h2>
                    <div className="space-y-2">
                        <Link href={route('admin.users.index')} className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">
                            <Users className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Kelola Pengguna</span>
                        </Link>
                        <Link href={route('admin.works.index')} className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Kelola Karya Tulis</span>
                        </Link>
                        <Link href={route('admin.works.trashed')} className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <span className="text-sm font-medium text-gray-700">Karya Dihapus</span>
                        </Link>
                        <Link href={route('admin.departments.index')} className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">
                            <FileText className="h-5 w-5 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">Kelola Program Studi</span>
                        </Link>
                        <Link href={route('admin.work-categories.index')} className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">
                            <BarChart3 className="h-5 w-5 text-pink-600" />
                            <span className="text-sm font-medium text-gray-700">Kelola Kategori</span>
                        </Link>
                    </div>
                </div>

                {/* Reports */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Laporan & Analytics</h2>
                    <div className="space-y-2">
                        <Link href={route('admin.reports.index')} className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Laporan Umum</span>
                        </Link>
                        <Link href={route('admin.reports.works')} className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Statistik Karya</span>
                        </Link>
                        <Link href={route('admin.reports.users')} className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50">
                            <Users className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Statistik Pengguna</span>
                        </Link>
                        <button className="w-full rounded-lg p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <span>📥 Ekspor Data</span>
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
