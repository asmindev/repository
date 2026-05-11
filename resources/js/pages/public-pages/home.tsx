import PublicLayout from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Work } from '@/types/work';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, Calendar, Download, Eye, FileText, Search, Users } from 'lucide-react';
import { useState } from 'react';

interface Props {
    featuredWorks: Work[];
    recentWorks: Work[];
}

export default function Home({ featuredWorks, recentWorks }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const { name } = usePage<any>().props;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('search'), { q: searchQuery });
    };

    return (
        <PublicLayout>
            <Head title={`${name} - Repositori Karya Tulis Ilmiah`} />

            {/* ─── Hero Section ─────────────────────────────────────── */}
            <section className="border-b border-border bg-background py-16 sm:py-24">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                        Akses Pengetahuan <br />
                        <span className="text-primary">Satu Pencarian.</span>
                    </h1>
                    <p className="mb-10 text-lg text-muted-foreground">
                        Platform repositori digital untuk menyimpan dan mencari karya tulis ilmiah, skripsi, dan riset akademik terbaik.
                    </p>

                    <div className="mx-auto max-w-2xl">
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center gap-2 rounded-xl border border-input bg-background p-1.5 shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
                        >
                            <div className="flex h-10 w-10 items-center justify-center text-muted-foreground">
                                <Search className="h-5 w-5" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Cari judul, penulis, atau prodi..."
                                className="h-10 w-full border-none bg-transparent text-foreground shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button type="submit" className="hidden h-10 rounded-lg bg-primary px-6 font-semibold hover:bg-primary/90 sm:flex">
                                Cari
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-6xl px-2 py-16 md:px-6">
                {/* ─── Featured Section ────────────────────────────────── */}
                {featuredWorks.length > 0 && (
                    <section id="featured" className="mb-20">
                        <div className="mb-8 flex items-end justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Karya Pilihan</h2>
                                <p className="text-sm text-muted-foreground">Koleksi karya ilmiah terbaik bulan ini.</p>
                            </div>
                            <Link href={route('search')} className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                                Lihat Semua <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featuredWorks.map((work) => (
                                <Link key={work.id} href={route('works.show', work.id)} className="group">
                                    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm">
                                        <div className="flex gap-4">
                                            {/* Thumbnail Cover Image */}
                                            <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted/20">
                                                {work.cover_image_path ? (
                                                    <img
                                                        src={`/storage/${work.cover_image_path}`}
                                                        alt={work.title}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full flex-col items-center justify-center p-1 text-center">
                                                        <BookOpen className="mb-1 h-6 w-6 text-muted-foreground/20" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex min-w-0 flex-1 flex-col">
                                                <div className="mb-2 inline-block self-start rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
                                                    {work.category?.name || 'Karya'}
                                                </div>
                                                <h3 className="mb-2 line-clamp-2 text-sm leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
                                                    {work.title}
                                                </h3>
                                                <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Users className="h-3 w-3 shrink-0" />
                                                        <span className="truncate">{work.author?.name}</span>
                                                    </div>
                                                    {work.supervisors && work.supervisors.length > 0 && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Users className="h-3 w-3 shrink-0" />
                                                            <span className="line-clamp-1 text-muted-foreground/80">
                                                                {work.supervisors.map((s) => s.name).join(', ')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4 text-[10px] font-medium text-muted-foreground/80">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-3.5 w-3.5" /> {work.view_count || 0}
                                                </span>
                                                {work.category && work.category.can_download && (
                                                    <span className="flex items-center gap-1">
                                                        <Download className="h-3.5 w-3.5" /> {work.download_count || 0}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" /> {work.year}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ─── Recent Section ──────────────────────────────────── */}
                {recentWorks.length > 0 && (
                    <section className="mb-10">
                        <h2 className="mb-6 text-2xl font-bold text-foreground">Publikasi Terbaru</h2>
                        <div className="divide-y divide-border/50 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                            {recentWorks.map((work) => (
                                <Link
                                    key={work.id}
                                    href={route('works.show', work.id)}
                                    className="group block p-5 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground transition-all">
                                            {work.cover_image_path ? (
                                                <img
                                                    src={`/storage/${work.cover_image_path}`}
                                                    alt={work.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            ) : (
                                                <FileText className="h-5 w-5 transition-colors group-hover:text-primary" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-base font-bold text-foreground transition-colors group-hover:text-primary">
                                                {work.title}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                                                    {work.category?.name}
                                                </span>
                                                <span>•</span>
                                                <span className="truncate">{work.author?.name}</span>
                                                {work.supervisors && work.supervisors.length > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="truncate">Pembimbing: {work.supervisors.map((s) => s.name).join(', ')}</span>
                                                    </>
                                                )}
                                                <span>•</span>
                                                <span>{work.year}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-muted-foreground/60">
                                            <div className="hidden text-right sm:block">
                                                <div className="text-xs font-bold text-foreground">{work.view_count || 0}</div>
                                                <div className="text-[10px] uppercase">Views</div>
                                            </div>
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </PublicLayout>
    );
}
