import PublicLayout from '@/components/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Work } from '@/types/work';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, Download, Eye, FileText, Users } from 'lucide-react';

interface Props {
    work: Work;
}

export default function WorkDetail({ work }: Props) {
    const { name } = usePage<any>().props;

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
            <Head title={`${work.title} - ${name}`} />

            <div className="py-8 md:mx-auto md:w-10/12">
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Header Nav */}
                    <div className="mb-6">
                        <Link
                            href={route('search')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
                                <Badge variant="secondary" className="border-0 bg-primary/10 text-primary hover:bg-primary/20">
                                    {work.category?.name}
                                </Badge>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{work.title}</h1>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 shrink-0" />
                                        <span className="font-medium text-foreground/80">{work.author?.name}</span>
                                    </div>
                                    {work.supervisors && work.supervisors.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 shrink-0" />
                                            <span className="font-medium text-foreground/80">
                                                Pembimbing: {work.supervisors.map((s) => s.name).join(', ')}
                                            </span>
                                        </div>
                                    )}
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
                            <Card className="border-border shadow-sm">
                                <CardHeader className="border-b pb-3">
                                    <CardTitle className="text-lg">Abstrak</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-justify text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                                        {work.abstract || 'Tidak ada abstrak.'}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Dokumen / Bab */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="border-b pb-3">
                                    <CardTitle className="text-lg">Dokumen Lampiran</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="divide-y divide-border">
                                        {/* Full File */}
                                        <div className="flex items-center justify-between py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">Naskah Lengkap (Full Text)</p>
                                                    <p className="text-xs text-muted-foreground">Berkas PDF Keseluruhan</p>
                                                </div>
                                            </div>
                                            <a href={route('works.download', work.id)} target="_blank" rel="noopener noreferrer">
                                                <Button size="sm" variant="outline" className="gap-2 transition-all">
                                                    <Download className="h-4 w-4" /> <span className="hidden sm:inline">Unduh</span>
                                                </Button>
                                            </a>
                                        </div>

                                        {/* Chapters */}
                                        {work.chapters?.map((chapter) => (
                                            <div key={chapter.id} className="flex items-center justify-between py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                        <span className="text-sm font-bold">{chapter.chapter_number}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{chapter.title}</p>
                                                        <p className="text-xs text-muted-foreground">Berkas PDF Bab {chapter.chapter_number}</p>
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
                                                        className="gap-2 text-primary transition-all hover:bg-primary/10 hover:text-primary"
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
                                    <h3 className="mb-3 text-sm font-medium text-foreground/80">Kata Kunci:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {work.keywords.map((keyword, idx) => (
                                            <Link
                                                key={idx}
                                                href={route('search', { q: keyword })}
                                                className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
                            <Card className="border-0 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                <CardContent className="p-6">
                                    <h3 className="mb-2 text-lg font-semibold text-primary-foreground">Unduh Naskah</h3>
                                    <p className="mb-4 text-sm text-primary-foreground/80">
                                        Dapatkan akses ke dokumen lengkap PDF dari karya ilmiah ini.
                                    </p>
                                    <a href={route('works.download', work.id)} target="_blank" rel="noopener noreferrer" className="block">
                                        <Button
                                            size="lg"
                                            className="w-full gap-2 bg-background font-semibold text-primary transition-all hover:bg-muted active:scale-[0.98]"
                                        >
                                            <Download className="h-5 w-5" />
                                            Unduh Naskah Lengkap
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>

                            <Card className="border-border shadow-sm">
                                <CardHeader className="border-b pb-3">
                                    <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                        Informasi Detail
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">Penulis</p>
                                        <p className="text-sm font-medium text-foreground">{work.author?.name}</p>
                                    </div>
                                    {work.supervisors && work.supervisors.length > 0 && (
                                        <div>
                                            <p className="mb-1 text-xs text-muted-foreground">Pembimbing</p>
                                            <p className="text-sm font-medium text-foreground">{work.supervisors.map((s) => s.name).join(', ')}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">Program Studi</p>
                                        <p className="text-sm font-medium text-foreground">{work.department?.name}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">Tahun Publikasi</p>
                                        <p className="text-sm font-medium text-foreground">{work.year}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">Bahasa</p>
                                        <p className="text-sm font-medium text-foreground">
                                            {work.language === 'id' ? 'Indonesia' : work.language === 'en' ? 'Inggris' : work.language}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">Tanggal Publikasi</p>
                                        <p className="text-sm font-medium text-foreground">{formatDate(work.published_at)}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border shadow-sm">
                                <CardContent className="p-0">
                                    <div className="flex divide-x divide-border">
                                        <div className="flex flex-1 flex-col items-center justify-center p-4">
                                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Eye className="h-5 w-5" />
                                            </div>
                                            <span className="text-2xl font-bold text-foreground">{work.view_count || 0}</span>
                                            <span className="text-xs text-muted-foreground">Dilihat</span>
                                        </div>
                                        <div className="flex flex-1 flex-col items-center justify-center p-4">
                                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                                                <Download className="h-5 w-5" />
                                            </div>
                                            <span className="text-2xl font-bold text-foreground">{work.download_count || 0}</span>
                                            <span className="text-xs text-muted-foreground">Diunduh</span>
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
