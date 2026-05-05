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
                        <Button variant="outline" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
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
                                    <User className="h-4 w-4" /> {work.author?.name}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" /> {work.year}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Globe className="h-4 w-4" /> {work.language.toUpperCase()}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Abstract */}
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">Abstrak</h3>
                                <p className="text-sm leading-relaxed text-justify text-gray-600 whitespace-normal">
                                    {work.abstract || 'Tidak ada abstrak.'}
                                </p>
                            </div>

                            {/* Keywords */}
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">Kata Kunci</h3>
                                <div className="flex flex-wrap gap-2">
                                    {work.keywords?.length > 0 ? (
                                        work.keywords.map((kw, i) => (
                                            <Badge key={i} variant="secondary" className="font-normal">
                                                {kw}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">—</span>
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
                                    <TableHeader className="bg-gray-50">
                                        <TableRow>
                                            <TableHead className="w-16 text-center">Bab</TableHead>
                                            <TableHead>Judul Bab</TableHead>
                                            <TableHead className="text-right">Ukuran</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {work.chapters && work.chapters.length > 0 ? (
                                            work.chapters.map((chapter) => (
                                                <TableRow key={chapter.id}>
                                                    <TableCell className="text-center font-medium">{chapter.chapter_number}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-blue-500" />
                                                            {chapter.title}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right text-xs text-gray-500">
                                                        {formatSize(chapter.file_size)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="py-8 text-center text-gray-500">
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
                                            <Avatar className="h-8 w-8 shrink-0">
                                                <AvatarImage
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer?.name || 'R')}`}
                                                />
                                                <AvatarFallback>{review.reviewer?.name?.charAt(0) || 'R'}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900">{review.reviewer?.name || 'Reviewer'}</p>
                                                    <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {review.action.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                {review.notes && (
                                                    <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm text-gray-700">{review.notes}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-sm text-gray-500">Belum ada riwayat review.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                    {/* Ubah Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubah Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Pilih Status Baru</label>
                                <Select value={status} onValueChange={(val: WorkStatus) => setStatus(val)}>
                                    <SelectTrigger className="w-full bg-white">
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
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-500">Kategori</span>
                                <span className="font-medium text-gray-900">{work.category?.name ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-500">Departemen</span>
                                <span className="font-medium text-gray-900">{work.department?.name ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-500">Visibilitas</span>
                                {work.visibility === 'public' ? (
                                    <span className="flex items-center gap-1 font-medium text-emerald-600">
                                        <Globe className="h-3.5 w-3.5" /> Publik
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 font-medium text-gray-500">
                                        <Lock className="h-3.5 w-3.5" /> Terbatas
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-500">Pembimbing</span>
                                <span className="font-medium text-gray-900">{work.supervisor?.name ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-500">Dilihat</span>
                                <span className="flex items-center gap-1 font-medium text-gray-900">
                                    <Eye className="h-3.5 w-3.5" /> {work.view_count}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-500">Diunduh</span>
                                <span className="flex items-center gap-1 font-medium text-gray-900">
                                    <Download className="h-3.5 w-3.5" /> {work.download_count}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-gray-500">Tanggal Submit</span>
                                <span className="font-medium text-gray-900">{formatDate(work.submitted_at)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Tanggal Publikasi</span>
                                <span className="font-medium text-gray-900">{formatDate(work.published_at)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
