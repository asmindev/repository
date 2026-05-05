import AppLayout from '@/components/layouts/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Work, WorkStatus } from '@/types/work';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, Download, Eye, FileText, Globe, Lock, Save, User } from 'lucide-react';
import { useState } from 'react';

interface Props {
    work: Work;
}

const STATUS_CONFIG: Record<WorkStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    draft: { label: 'Draft', variant: 'secondary' },
    pending_review: { label: 'Menunggu Review', variant: 'outline' },
    in_review: { label: 'Sedang Direview', variant: 'default' },
    revision: { label: 'Revisi', variant: 'outline' },
    approved: { label: 'Disetujui', variant: 'default' },
    published: { label: 'Dipublikasi', variant: 'default' },
    rejected: { label: 'Ditolak', variant: 'destructive' },
};

function StatusBadge({ status }: { status: WorkStatus }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status, variant: 'secondary' };
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export default function WorksShow({ work }: Props) {
    const [status, setStatus] = useState<WorkStatus>(work.status);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveStatus = () => {
        setIsSaving(true);
        router.patch(
            route('admin.works.change-status', work.id),
            { status },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const formatDate = (dateStr: string | null) =>
        dateStr ? new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    const formatSize = (bytes: number | null) => {
        if (!bytes) return '—';
        return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
    };

    return (
        <AppLayout header={<h1 className="font-bold">Detail Karya</h1>}>
            <Head title={`Detail: ${work.title} - Repository KTI`} />

            {/* Header Actions */}
            <div className="mt-6 flex items-center justify-between">
                <Link href={route('admin.works.index')}>
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <Link href={route('admin.works.chapters.index', work.id)}>
                        <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/10">
                            <BookOpen className="h-4 w-4" /> Kelola Bab
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">{work.title}</CardTitle>
                                <StatusBadge status={work.status} />
                            </div>
                            <CardDescription className="mt-2 flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4 text-muted-foreground" /> {work.author?.name}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-muted-foreground" /> {work.year}
                                </span>
                                <span className="flex items-center gap-1 font-medium text-muted-foreground uppercase">
                                    <Globe className="h-4 w-4" /> {work.language}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Abstract */}
                            <div>
                                <h3 className="mb-2 font-semibold text-foreground">Abstrak</h3>
                                <p className="text-justify text-sm leading-relaxed whitespace-normal text-muted-foreground">
                                    {work.abstract || 'Tidak ada abstrak.'}
                                </p>
                            </div>

                            {/* Keywords */}
                            <div>
                                <h3 className="mb-2 font-semibold text-foreground">Kata Kunci</h3>
                                <div className="flex flex-wrap gap-2">
                                    {work.keywords?.length > 0 ? (
                                        work.keywords.map((kw, i) => (
                                            <Badge key={i} variant="secondary" className="font-normal">
                                                {kw}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground">—</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chapters Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Bab</CardTitle>
                            <CardDescription>File dokumen karya yang telah dipecah per bab.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-md border">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-16 text-center font-semibold text-muted-foreground">Bab</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Judul Bab</TableHead>
                                            <TableHead className="text-right font-semibold text-muted-foreground">Ukuran</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {work.chapters && work.chapters.length > 0 ? (
                                            work.chapters.map((chapter) => (
                                                <TableRow key={chapter.id} className="transition-colors hover:bg-muted/30">
                                                    <TableCell className="text-center font-medium">{chapter.chapter_number}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-primary" />
                                                            <span className="text-foreground">{chapter.title}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right text-xs text-muted-foreground">
                                                        {formatSize(chapter.file_size)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                                                    Belum ada bab yang diunggah.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Review</CardTitle>
                            <CardDescription>Catatan review dari dosen penguji/pembimbing.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {work.reviews && work.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {work.reviews.map((review) => (
                                        <div key={review.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                                            <Avatar className="h-8 w-8 shrink-0 border">
                                                <AvatarImage
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer?.name || 'R')}&background=random`}
                                                />
                                                <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
                                                    {review.reviewer?.name?.charAt(0) || 'R'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-foreground">{review.reviewer?.name || 'Reviewer'}</p>
                                                    <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="h-4 border-muted-foreground/30 py-0 text-[10px] text-muted-foreground"
                                                    >
                                                        {review.action.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                {review.notes && (
                                                    <div className="mt-2 rounded-md border border-border/50 bg-muted/50 p-3 text-sm leading-relaxed text-muted-foreground italic">
                                                        "{review.notes}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-sm text-muted-foreground italic">Belum ada riwayat review.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                    {/* Ubah Status */}
                    <Card className="border-primary/20 shadow-primary/5">
                        <CardHeader>
                            <CardTitle>Ubah Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Pilih Status Baru</label>
                                <Select value={status} onValueChange={(val: WorkStatus) => setStatus(val)}>
                                    <SelectTrigger className="w-full bg-background">
                                        <SelectValue placeholder="Pilih status..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                                            <SelectItem key={val} value={val}>
                                                {cfg.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleSaveStatus} disabled={status === work.status || isSaving} className="w-full gap-2">
                                <Save className="h-4 w-4" />
                                {isSaving ? 'Menyimpan...' : 'Simpan Status'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Publikasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Kategori</span>
                                <span className="font-medium text-foreground">{work.category?.name ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Departemen</span>
                                <span className="font-medium text-foreground">{work.department?.name ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Visibilitas</span>
                                {work.visibility === 'public' ? (
                                    <span className="flex items-center gap-1 font-medium text-emerald-600">
                                        <Globe className="h-3.5 w-3.5" /> Publik
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 font-medium text-muted-foreground">
                                        <Lock className="h-3.5 w-3.5" /> Terbatas
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Pembimbing</span>
                                <span className="font-medium text-foreground">{work.supervisors?.map((s) => s.name).join(', ')}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Dilihat</span>
                                <span className="flex items-center gap-1 font-medium text-foreground">
                                    <Eye className="h-3.5 w-3.5" /> {work.view_count}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Diunduh</span>
                                <span className="flex items-center gap-1 font-medium text-foreground">
                                    <Download className="h-3.5 w-3.5" /> {work.download_count}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Tanggal Submit</span>
                                <span className="font-medium text-foreground">{formatDate(work.submitted_at)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Tanggal Publikasi</span>
                                <span className="font-medium text-foreground">{formatDate(work.published_at)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
