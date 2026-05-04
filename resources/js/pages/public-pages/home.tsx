import PublicLayout from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import type { Work } from '@/types/work';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Search } from 'lucide-react';

interface Props {
    featuredWorks: Work[];
    recentWorks: Work[];
}

export default function Home({ featuredWorks, recentWorks }: Props) {
    return (
        <PublicLayout>
            <Head title="Repository KTI - Karya Tulis Ilmiah" />

            {/* ─── Hero Section ─────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-24 sm:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400 opacity-20 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-400 opacity-20 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                        <BookOpen className="h-4 w-4 text-white" />
                        <span className="text-sm font-semibold text-white">Repositori Karya Tulis Ilmiah Terpadu</span>
                    </div>

                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                        Temukan Karya Tulis Ilmiah Berkualitas
                    </h1>

                    <p className="mb-8 text-lg text-blue-100 sm:text-xl">
                        Koleksi lengkap Skripsi, KTI, dan Tesis dari mahasiswa terbaik. Akses mudah, pencarian cepat, dan pengetahuan tak terbatas.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link href="/search">
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                <Search className="mr-2 h-5 w-5" />
                                Cari Karya
                            </Button>
                        </Link>

                        <a href="#featured">
                            <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10 sm:w-auto">
                                Lihat Koleksi
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* ─── Stats Section ──────────────────────────────────── */}
            <section className="border-b border-gray-200 bg-white px-6 py-16">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mb-2 text-3xl font-bold text-blue-600">1000+</div>
                            <p className="text-gray-600">Karya Tulis Tersimpan</p>
                        </div>
                        <div className="text-center">
                            <div className="mb-2 text-3xl font-bold text-blue-600">500+</div>
                            <p className="text-gray-600">Mahasiswa Kontributor</p>
                        </div>
                        <div className="text-center">
                            <div className="mb-2 text-3xl font-bold text-blue-600">10+</div>
                            <p className="text-gray-600">Program Studi</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Featured Works ────────────────────────────────── */}
            {featuredWorks.length > 0 && (
                <section id="featured" className="bg-white px-6 py-16 sm:py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-12">
                            <h2 className="mb-2 text-3xl font-bold text-gray-900">Karya Pilihan</h2>
                            <p className="text-gray-600">Karya tulis terbaik dan terbaru dari komunitas kami</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {featuredWorks.map((work) => (
                                <Link key={work.id} href={route('works.show', work.id)}>
                                    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                                        <div className="border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-8">
                                            <div className="mb-3 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                {work.category?.name ?? 'Karya'}
                                            </div>
                                            <h3 className="line-clamp-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                                                {work.title}
                                            </h3>
                                        </div>

                                        <div className="p-6">
                                            <p className="mb-4 line-clamp-3 text-sm text-gray-600">{work.abstract}</p>

                                            <div className="mb-4 space-y-2 text-sm text-gray-600">
                                                <p>
                                                    <span className="font-medium text-gray-900">Penulis:</span> {work.author?.name}
                                                </p>
                                                <p>
                                                    <span className="font-medium text-gray-900">Program Studi:</span> {work.department?.name}
                                                </p>
                                                <p>
                                                    <span className="font-medium text-gray-900">Tahun:</span> {work.year}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>{work.view_count ?? 0} views</span>
                                                <span>{work.download_count ?? 0} downloads</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Recent Works ────────────────────────────────────── */}
            {recentWorks.length > 0 && (
                <section className="border-t border-gray-200 bg-gray-50 px-6 py-16 sm:py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-12">
                            <h2 className="mb-2 text-3xl font-bold text-gray-900">Karya Terbaru</h2>
                            <p className="text-gray-600">Publikasi terkini dari repository kami</p>
                        </div>

                        <div className="space-y-4">
                            {recentWorks.map((work) => (
                                <Link key={work.id} href={route('works.show', work.id)}>
                                    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-md">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                        {work.category?.name}
                                                    </span>
                                                </div>
                                                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">{work.title}</h3>
                                                <p className="mb-3 line-clamp-2 text-sm text-gray-600">{work.abstract}</p>
                                                <div className="text-sm text-gray-500">
                                                    <span className="font-medium text-gray-900">{work.author?.name}</span> • {work.department?.name} •{' '}
                                                    {work.year}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>{work.view_count ?? 0} views</span>
                                                <span>{work.download_count ?? 0} downloads</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <Link href="/search">
                                <Button variant="outline" size="lg">
                                    Lihat Semua Karya
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
