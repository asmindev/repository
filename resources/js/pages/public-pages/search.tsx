import PublicLayout from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Pagination as PaginationType } from '@/types/pagination';
import type { Work } from '@/types/work';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Download, Eye, Filter, Search, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    results: PaginationType<Work>;
    query: string;
    filters: {
        category?: string | null;
        department?: string | null;
        sort: string;
    };
}

export default function SearchPage({ results, query, filters }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const { name } = usePage<any>().props;
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
            <Head title={query ? `Hasil Pencarian: ${query} - ${name}` : `Cari Karya Tulis - ${name}`} />

            {/* ─── Search Header ──────────────────────────────────── */}
            <div className="border-b border-border bg-background px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-6 text-3xl font-bold text-foreground">Cari Karya Tulis</h1>

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
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <Filter className="h-4 w-4" />
                            Filter Pencarian
                        </Button>

                        {/* Expandable Filters */}
                        {showFilters && (
                            <div className="animate-in space-y-4 rounded-lg border border-border bg-muted/30 p-4 duration-200 fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Urutkan Berdasarkan</label>
                                    <Select value={data.sort} onValueChange={(val) => setData('sort', val)}>
                                        <SelectTrigger className="w-full bg-background md:w-[240px]">
                                            <SelectValue placeholder="Pilih Urutan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="latest">Terbaru</SelectItem>
                                            <SelectItem value="popular">Paling Dilihat</SelectItem>
                                            <SelectItem value="downloads">Paling Diunduh</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Button type="submit" size="sm" className="px-6">
                                        Terapkan Filter
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setShowFilters(false)}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="mr-2 h-3.5 w-3.5" />
                                        Tutup
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* ─── Results ────────────────────────────────────────── */}
            <section className="bg-muted/20 px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    {query && (
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan hasil untuk: <span className="font-semibold text-foreground">"{query}"</span>
                                </p>
                                <p className="text-xs text-muted-foreground/60">Ditemukan {results.meta?.total ?? 0} hasil</p>
                            </div>
                        </div>
                    )}

                    {results.data.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {results.data.map((work) => (
                                    <Link key={work.id} href={route('works.show', work.id)}>
                                        <div className="group overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                <div className="flex-1">
                                                    {/* Category Badge */}
                                                    <div className="mb-2">
                                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                            {work.category?.name}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="mb-3 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                                                        {work.title}
                                                    </h3>

                                                    {/* Abstract */}
                                                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{work.abstract}</p>

                                                    {/* Metadata */}
                                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="font-medium text-foreground/70">{work.author?.name}</span>
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
                                                <div className="flex flex-shrink-0 gap-6 text-sm text-muted-foreground/70">
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
                                <div className="mt-8">
                                    <Pagination>
                                        <PaginationContent>
                                            {results.links.map((link, idx) => {
                                                const isPrev = link.label.includes('Previous');
                                                const isNext = link.label.includes('Next');
                                                const isEllipsis = link.label === '...';

                                                return (
                                                    <PaginationItem key={idx}>
                                                        {isPrev ? (
                                                            <PaginationPrevious 
                                                                href={link.url ?? '#'} 
                                                                className={cn(!link.url && 'pointer-events-none opacity-50')}
                                                            />
                                                        ) : isNext ? (
                                                            <PaginationNext 
                                                                href={link.url ?? '#'} 
                                                                className={cn(!link.url && 'pointer-events-none opacity-50')}
                                                            />
                                                        ) : isEllipsis ? (
                                                            <PaginationEllipsis />
                                                        ) : (
                                                            <PaginationLink 
                                                                href={link.url ?? '#'} 
                                                                isActive={link.active}
                                                            >
                                                                {link.label}
                                                            </PaginationLink>
                                                        )}
                                                    </PaginationItem>
                                                );
                                            })}
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-lg border border-border bg-card p-12 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <Search className="h-8 w-8 text-muted-foreground/40" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">Tidak ada hasil</h3>
                            <p className="mb-6 text-muted-foreground">
                                {query
                                    ? `Tidak ditemukan karya yang cocok dengan "${query}". Coba gunakan kata kunci lain.`
                                    : 'Gunakan kotak pencarian di atas untuk mencari karya tulis.'}
                            </p>
                            {query && (
                                <Link href="/search">
                                    <Button variant="outline">
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
