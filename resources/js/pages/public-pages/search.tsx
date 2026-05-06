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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Pagination as PaginationType } from '@/types/pagination';
import type { Work } from '@/types/work';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, Download, Eye, Filter, Search, User, Users } from 'lucide-react';
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
    console.log(results);
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
            <Head title={query ? `Hasil Pencarian: ${query} - ${name}` : `Repository ${name}`} />

            {/* ─── Search Header ──────────────────────────────────── */}
            <div className="border-b border-border bg-background px-6 py-6">
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-4 text-xl font-bold tracking-tight text-foreground">{`Repository ${name}`}</h1>

                    <form onSubmit={handleSearch} className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Cari judul, penulis, atau kata kunci..."
                                value={data.q}
                                onChange={(e) => setData('q', e.target.value)}
                                className="h-9 flex-1 text-sm"
                            />
                            <Button type="submit" className="h-9 text-sm">
                                <Search className="mr-2 h-3.5 w-3.5" />
                                Cari
                            </Button>
                        </div>

                        {/* Filter Toggle */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex h-7 items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
                        >
                            <Filter className="h-3 w-3" />
                            Filter Pencarian
                        </Button>

                        {/* Expandable Filters */}
                        {showFilters && (
                            <div className="animate-in space-y-3 rounded-lg border border-border bg-muted/30 p-3 duration-200 fade-in slide-in-from-top-1">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">Urutkan</label>
                                    <Select value={data.sort} onValueChange={(val) => setData('sort', val)}>
                                        <SelectTrigger className="h-8 w-full bg-background text-xs md:w-[200px]">
                                            <SelectValue placeholder="Pilih Urutan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="latest">Terbaru</SelectItem>
                                            <SelectItem value="popular">Paling Dilihat</SelectItem>
                                            <SelectItem value="downloads">Paling Diunduh</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button type="submit" size="sm" className="h-7 px-4 text-[11px]">
                                        Terapkan
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFilters(false)}
                                        className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
                                    >
                                        Tutup
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* ─── Results ────────────────────────────────────────── */}
            <section className="bg-muted/5 p-3 md:p-6">
                <div className="mx-auto max-w-4xl">
                    {query && (
                        <div className="mb-4">
                            <p className="text-muted-foreground">
                                Hasil: <span className="font-semibold text-foreground">"{query}"</span>
                                <span className="ml-1 opacity-60">({results.total ?? 0})</span>
                            </p>
                        </div>
                    )}

                    {results.data.length > 0 ? (
                        <>
                            <div className="grid gap-2">
                                {results.data.map((work) => (
                                    <Link key={work.id} href={route('works.show', work.id)} className="group block">
                                        <div className="flex h-[130px] w-full flex-row overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:shadow-md">
                                            {/* Fixed Width Cover Image */}
                                            <div className="relative h-full w-20 shrink-0 border-r border-border/50 bg-muted/20 sm:w-24 lg:w-28">
                                                {work.cover_image_path ? (
                                                    <img
                                                        src={`/storage/${work.cover_image_path}`}
                                                        alt={work.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center">
                                                        <BookOpen className="mb-1 h-5 w-5 text-muted-foreground/10" />
                                                        <p className="text-[6px] font-bold tracking-widest text-muted-foreground/20 uppercase">
                                                            No Cover
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content Side - Forced Horizontal Constraints */}
                                            <div className="flex w-[calc(100%-80px)] min-w-0 flex-1 flex-col overflow-hidden p-2.5 sm:w-[calc(100%-96px)] md:py-2 md:pr-4 md:pl-3 lg:w-[calc(100%-112px)]">
                                                {/* Fix: hapus truncate, pakai line-clamp-1 saja untuk title */}
                                                <h3 className="line-clamp-2 w-full text-sm leading-tight font-bold text-blue-500 group-hover:text-blue-600 md:text-xl md:leading-tight">
                                                    {work.title}
                                                </h3>

                                                {/* Fix: line-clamp-1 untuk keywords agar tidak makan terlalu banyak ruang */}
                                                {work.keywords && work.keywords.length > 0 && (
                                                    <div className="mt-0.5 mb-1 w-full overflow-hidden">
                                                        <p className="line-clamp-1 w-full text-xs font-medium text-muted-foreground/60 md:text-sm">
                                                            Keyword: {work.keywords.join(', ')}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Meta Information Container */}
                                                <div className="mt-auto flex flex-col gap-1 border-t border-border/40 pt-1.5 text-blue-400 md:flex-row md:items-center md:gap-x-4 md:pt-2">
                                                    {/* People Group */}
                                                    <div className="flex w-full items-center gap-x-3 gap-y-1 overflow-hidden md:w-auto">
                                                        <div className="flex min-w-0 items-center gap-1 overflow-hidden">
                                                            <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-muted/50">
                                                                <User className="size-2.5" />
                                                            </div>
                                                            <span className="truncate text-[10px] font-medium md:text-xs">{work.author?.name}</span>
                                                        </div>

                                                        {/* Hidden on mobile to save space, only author is enough for horizontal tiny card */}
                                                        <div className="hidden min-w-0 items-center gap-1 overflow-hidden sm:flex">
                                                            <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-muted/50">
                                                                <Users className="size-2.5" />
                                                            </div>
                                                            <span className="truncate text-[10px] font-medium md:text-xs">
                                                                {work.supervisors && work.supervisors.length > 0
                                                                    ? work.supervisors.map((s) => s.name).join(', ')
                                                                    : '—'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Info & Stats Group */}
                                                    <div className="flex w-full items-center justify-between gap-3 font-medium md:ml-auto md:w-auto md:justify-start">
                                                        <div className="flex items-center gap-2 overflow-hidden md:gap-3">
                                                            <div className="flex shrink-0 items-center gap-0.5 md:gap-1">
                                                                <Calendar className="size-3 shrink-0 opacity-70" />
                                                                <span className="text-[10px] md:text-xs">{work.year}</span>
                                                            </div>
                                                            <span className="max-w-[80px] truncate text-[10px] md:max-w-[120px] md:text-xs">
                                                                {work.department?.name}
                                                            </span>
                                                        </div>

                                                        {/* Stats Group */}
                                                        <div className="flex shrink-0 items-center gap-2 border-l border-border/40 pl-2 md:pl-3">
                                                            <div className="flex items-center gap-0.5">
                                                                <Eye className="size-3 opacity-70" />
                                                                <span className="text-[10px] md:text-xs">{work.view_count ?? 0}</span>
                                                            </div>
                                                            <div className="flex items-center gap-0.5">
                                                                <Download className="size-3 opacity-70" />
                                                                <span className="text-[10px] md:text-xs">{work.download_count ?? 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Extra Compact Pagination */}
                            {results.links && results.links.length > 0 && (
                                <div className="mt-6 flex justify-center">
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
                                                                className={cn('h-7 px-2 text-[10px]', !link.url && 'pointer-events-none opacity-50')}
                                                            />
                                                        ) : isNext ? (
                                                            <PaginationNext
                                                                href={link.url ?? '#'}
                                                                className={cn('h-7 px-2 text-[10px]', !link.url && 'pointer-events-none opacity-50')}
                                                            />
                                                        ) : isEllipsis ? (
                                                            <PaginationEllipsis />
                                                        ) : (
                                                            <PaginationLink
                                                                href={link.url ?? '#'}
                                                                isActive={link.active}
                                                                className="h-7 w-7 text-[10px]"
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
                        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                                <Search className="h-6 w-6 text-muted-foreground/20" />
                            </div>
                            <h3 className="mb-1 text-base font-bold text-foreground">Tidak ada hasil</h3>
                            <p className="mx-auto mb-4 max-w-sm text-[11px] text-muted-foreground">Tidak ditemukan karya tulis yang sesuai.</p>
                            {query && (
                                <Link href="/search">
                                    <Button variant="outline" size="sm" className="h-7 rounded-full px-5 text-[11px]">
                                        Bersihkan
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
