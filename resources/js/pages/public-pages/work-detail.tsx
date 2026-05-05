import PublicLayout from '@/components/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Work } from '@/types/work';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, Download, Eye, FileText, Users } from 'lucide-react';

interface Props {
    work: Work;
}

export default function WorkDetail({ work }: Props) {
    const formatDate = (dateStr: string | null) =>
        dateStr
            ? new Date(dateStr).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
              })
            : '—';

    return (
        <PublicLayout>
            <Head title={work.title} />

            <div className="py-8">
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Header Nav */}
                    <div className="mb-6">
                        <Link
                            href={route('search')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Pencarian
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Main Content Area */}
                        <div className="space-y-6 md:col-span-2">
                            {/* Title & Meta Header */}
                            <div className="space-y-4">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100/80">
                                    {work.category?.name}
                                </Badge>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{work.title}</h1>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 shrink-0" />
                                        <span className="font-medium text-gray-900">{work.author?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 shrink-0" />
                                        <span>{work.department?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 shrink-0" />
                                        <span>{work.year}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Abstract */}
                            <Card className="shadow-sm">
                                <CardHeader className="border-b pb-3">
                                    <CardTitle className="text-lg">Abstrak</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-justify text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                                        {work.abstract || 'Tidak ada abstrak.'}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Dokumen / Bab */}
                            <Card className="shadow-sm">
                                <CardHeader className="border-b pb-3">
                                    <CardTitle className="text-lg">Dokumen Lampiran</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="divide-y">
                                        {/* Full File */}
                                        <div className="flex items-center justify-between py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Naskah Lengkap (Full Text)</p>
                                                    <p className="text-xs text-gray-500">Berkas PDF Keseluruhan</p>
                                                </div>
                                            </div>
                                            <a href={route('works.download', work.id)} target="_blank" rel="noopener noreferrer">
                                                <Button size="sm" variant="outline" className="gap-2">
                                                    <Download className="h-4 w-4" /> <span className="hidden sm:inline">Unduh</span>
                                                </Button>
                                            </a>
                                        </div>

                                        {/* Chapters */}
                                        {work.chapters?.map((chapter) => (
                                            <div key={chapter.id} className="flex items-center justify-between py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
                                                        <span className="text-sm font-bold">{chapter.chapter_number}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{chapter.title}</p>
                                                        <p className="text-xs text-gray-500">Berkas PDF Bab {chapter.chapter_number}</p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={route('works.chapters.download', [work.id, chapter.id])}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="gap-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Keywords */}
                            {work.keywords && work.keywords.length > 0 && (
                                <div>
                                    <h3 className="mb-3 text-sm font-medium text-gray-900">Kata Kunci:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {work.keywords.map((keyword, idx) => (
                                            <Link
                                                key={idx}
                                                href={route('search', { q: keyword })}
                                                className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
                                            >
                                                {keyword}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Download Main Button */}
                            <Card className="border-0 bg-blue-600 text-white shadow-md">
                                <CardContent className="p-6">
                                    <h3 className="mb-2 text-lg font-semibold text-blue-50">Unduh Naskah</h3>
                                    <p className="mb-4 text-sm text-blue-200">Dapatkan akses ke dokumen lengkap PDF dari karya ilmiah ini.</p>
                                    <a href={route('works.download', work.id)} target="_blank" rel="noopener noreferrer" className="block">
                                        <Button size="lg" className="w-full gap-2 bg-white font-semibold text-blue-600 hover:bg-gray-50">
                                            <Download className="h-5 w-5" />
                                            Unduh Naskah Lengkap
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardHeader className="border-b pb-3">
                                    <CardTitle className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Informasi Detail</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">Penulis</p>
                                        <p className="text-sm font-medium text-gray-900">{work.author?.name}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">Program Studi</p>
                                        <p className="text-sm font-medium text-gray-900">{work.department?.name}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">Tahun Publikasi</p>
                                        <p className="text-sm font-medium text-gray-900">{work.year}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">Bahasa</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {work.language === 'id' ? 'Indonesia' : work.language === 'en' ? 'Inggris' : work.language}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">Tanggal Publikasi</p>
                                        <p className="text-sm font-medium text-gray-900">{formatDate(work.published_at)}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardContent className="p-0">
                                    <div className="flex divide-x divide-gray-100">
                                        <div className="flex flex-1 flex-col items-center justify-center p-4">
                                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                <Eye className="h-5 w-5" />
                                            </div>
                                            <span className="text-2xl font-bold text-gray-900">{work.view_count || 0}</span>
                                            <span className="text-xs text-gray-500">Dilihat</span>
                                        </div>
                                        <div className="flex flex-1 flex-col items-center justify-center p-4">
                                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                <Download className="h-5 w-5" />
                                            </div>
                                            <span className="text-2xl font-bold text-gray-900">{work.download_count || 0}</span>
                                            <span className="text-xs text-gray-500">Diunduh</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
