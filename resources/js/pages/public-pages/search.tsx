import PublicLayout from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Pagination } from '@/types/pagination';
import type { Work } from '@/types/work';
import { Head, Link, useForm } from '@inertiajs/react';
import { Download, Eye, Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface Props {
    results: Pagination<Work>;
    query: string;
    filters: {
        category?: string | null;
        department?: string | null;
        sort: string;
    };
}

export default function SearchPage({ results, query, filters }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const { data, setData, get } = useForm({
        q: query,
        category: filters.category ?? '',
        department: filters.department ?? '',
        sort: filters.sort || 'latest',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/search');
    };

    return (
        <PublicLayout>
            <Head title={query ? `Hasil Pencarian: ${query}` : 'Cari Karya Tulis'} />

            {/* ─── Search Header ──────────────────────────────────── */}
            <div className="border-b border-gray-200 bg-white px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-6 text-3xl font-bold text-gray-900">Cari Karya Tulis</h1>

                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Cari judul, penulis, atau kata kunci..."
                                value={data.q}
                                onChange={(e) => setData('q', e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit">
                                <Search className="mr-2 h-4 w-4" />
                                Cari
                            </Button>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <Filter className="h-4 w-4" />
                            Filter Pencarian
                        </button>

                        {/* Expandable Filters */}
                        {showFilters && (
                            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Urutkan Berdasarkan</label>
                                    <select
                                        value={data.sort}
                                        onChange={(e) => setData('sort', e.target.value)}
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    >
                                        <option value="latest">Terbaru</option>
                                        <option value="popular">Paling Dilihat</option>
                                        <option value="downloads">Paling Diunduh</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" size="sm">
                                        Terapkan Filter
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(false)}
                                        className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* ─── Results ────────────────────────────────────────── */}
            <section className="bg-gray-50 px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    {query && (
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Menampilkan hasil untuk: <span className="font-semibold text-gray-900">"{query}"</span>
                                </p>
                                <p className="text-xs text-gray-500">Ditemukan {results.meta?.total ?? 0} hasil</p>
                            </div>
                        </div>
                    )}

                    {results.data.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {results.data.map((work) => (
                                    <Link key={work.id} href={route('works.show', work.id)}>
                                        <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                <div className="flex-1">
                                                    {/* Category Badge */}
                                                    <div className="mb-2">
                                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                            {work.category?.name}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="mb-3 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                                                        {work.title}
                                                    </h3>

                                                    {/* Abstract */}
                                                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">{work.abstract}</p>

                                                    {/* Metadata */}
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                        <span>
                                                            <span className="font-medium text-gray-900">{work.author?.name}</span>
                                                        </span>
                                                        <span>•</span>
                                                        <span>{work.department?.name}</span>
                                                        <span>•</span>
                                                        <span>{work.year}</span>
                                                        {work.language && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{work.language === 'id' ? 'Bahasa Indonesia' : 'English'}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex flex-shrink-0 gap-6 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="h-4 w-4" />
                                                        <span>{work.view_count ?? 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Download className="h-4 w-4" />
                                                        <span>{work.download_count ?? 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {results.links && results.links.length > 0 && (
                                <div className="mt-8 flex items-center justify-center gap-2">
                                    {results.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                      ? 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                                      : 'cursor-not-allowed text-gray-400'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">Tidak ada hasil</h3>
                            <p className="mb-6 text-gray-600">
                                {query
                                    ? `Tidak ditemukan karya yang cocok dengan "${query}". Coba gunakan kata kunci lain.`
                                    : 'Gunakan kotak pencarian di atas untuk mencari karya tulis.'}
                            </p>
                            {query && (
                                <Link href="/search">
                                    <Button>
                                        <Search className="mr-2 h-4 w-4" />
                                        Cari Ulang
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
