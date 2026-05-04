import PublicLayout from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import type { Work } from '@/types/work';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, Download, Eye, Users } from 'lucide-react';

interface Props {
    work: Work;
}

export default function WorkDetail({ work }: Props) {
    const downloadFile = async () => {
        // TODO: Implement signed URL download
        try {
            const response = await fetch(route('works.download', work.id));
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${work.title}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <PublicLayout>
            <Head title={work.title} />

            {/* ─── Header ────────────────────────────────────────── */}
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-4xl px-6 py-6">
                    <Link href="/search" className="mb-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Pencarian
                    </Link>

                    <div className="mb-4 inline-block">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                            {work.category?.name}
                        </span>
                    </div>

                    <h1 className="mb-4 text-4xl font-bold text-gray-900">{work.title}</h1>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>
                                    <span className="font-medium text-gray-900">{work.author?.name}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                <span>{work.department?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{work.year}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={downloadFile} size="lg" className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Unduh PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Content ────────────────────────────────────────── */}
            <div className="bg-gray-50 px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Main Content */}
                        <div className="md:col-span-2">
                            {/* Abstract */}
                            <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900">Abstrak</h2>
                                <p className="leading-relaxed whitespace-pre-wrap text-gray-600">{work.abstract}</p>
                            </section>

                            {/* Keywords */}
                            {work.keywords && work.keywords.length > 0 && (
                                <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Kata Kunci</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {work.keywords.map((keyword, idx) => (
                                            <Link
                                                key={idx}
                                                href={`/search?q=${encodeURIComponent(keyword)}`}
                                                className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                                            >
                                                {keyword}
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Chapters */}
                            {work.chapters && work.chapters.length > 0 && (
                                <section className="rounded-lg bg-white p-8 shadow-sm">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Daftar Bab</h2>
                                    <div className="space-y-2">
                                        {work.chapters.map((chapter, idx) => (
                                            <div key={idx} className="flex items-center gap-3 border-b border-gray-200 py-3 last:border-b-0">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                                                    {chapter.chapter_number}
                                                </span>
                                                <span className="text-gray-700">{chapter.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* Stats */}
                            <div className="space-y-3 rounded-lg bg-white p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900">Statistik</h3>

                                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Eye className="h-4 w-4" />
                                        <span className="text-sm">Dilihat</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{work.view_count ?? 0}</span>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Download className="h-4 w-4" />
                                        <span className="text-sm">Diunduh</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{work.download_count ?? 0}</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 rounded-lg bg-white p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900">Informasi</h3>

                                <div className="space-y-3 border-t border-gray-200 pt-3">
                                    <div>
                                        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Penulis</p>
                                        <p className="text-sm text-gray-900">{work.author?.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Program Studi</p>
                                        <p className="text-sm text-gray-900">{work.department?.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Tahun Publikasi</p>
                                        <p className="text-sm text-gray-900">{work.year}</p>
                                    </div>

                                    {work.language && (
                                        <div>
                                            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Bahasa</p>
                                            <p className="text-sm text-gray-900">{work.language === 'id' ? 'Bahasa Indonesia' : 'English'}</p>
                                        </div>
                                    )}

                                    {work.published_at && (
                                        <div>
                                            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">Dipublikasikan</p>
                                            <p className="text-sm text-gray-900">
                                                {new Date(work.published_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Supervisor */}
                            {/* {work.supervisor && (
                                <div className="space-y-3 rounded-lg bg-white p-6 shadow-sm">
                                    <h3 className="font-semibold text-gray-900">Pembimbing</h3>
                                    <div className="border-t border-gray-200 pt-3">
                                        <p className="text-sm text-gray-900">{work.supervisor.name}</p>
                                    </div>
                                </div>
                            )} */}
                        </aside>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
