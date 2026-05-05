// File: resources/js/pages/admin/works/chapters/index.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Work, WorkChapter } from '@/types/work';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Edit,
    FileText,
    FileUp,
    Plus,
    Save,
    Trash2,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';

// ─── Types ───────────────────────────────────────────────

interface Props {
    work: Work;
    chapters: WorkChapter[];
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// ─── Main Page ────────────────────────────────────────────

export default function WorkChaptersIndex({ work, chapters }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    // Create Form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const {
        data: createData,
        setData: setCreateData,
        post: createPost,
        processing: createProcessing,
        errors: createErrors,
        reset: createReset,
        clearErrors: clearCreateErrors,
    } = useForm({
        title: '',
        chapter_number: '',
        description: '',
        file: null as File | null,
    });

    // Edit Form
    const [editingChapter, setEditingChapter] = useState<WorkChapter | null>(null);
    const {
        data: editData,
        setData: setEditData,
        post: editPost,
        processing: editProcessing,
        errors: editErrors,
        reset: editReset,
        clearErrors: clearEditErrors,
    } = useForm({
        title: '',
        chapter_number: '',
        description: '',
        file: null as File | null,
        _method: 'POST', // using POST instead of PUT because we're uploading files
    });

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [flash, setFlash] = useState<{ type: string; message: string } | null>(null);

    // ─── Handlers: Create ────────────────────────────────

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createPost(route('admin.works.chapters.store', work.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                createReset();
                setShowCreateForm(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
                setFlash({ type: 'success', message: 'Bab berhasil ditambahkan.' });
                setTimeout(() => setFlash(null), 3000);
            },
        });
    };

    // ─── Handlers: Edit ──────────────────────────────────

    const handleEditClick = (chapter: WorkChapter) => {
        clearEditErrors();
        setEditingChapter(chapter);
        setEditData({
            title: chapter.title,
            chapter_number: String(chapter.chapter_number),
            description: chapter.description ?? '',
            file: null,
            _method: 'POST',
        });
        setShowCreateForm(false);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingChapter) return;

        editPost(route('admin.works.chapters.update', [work.id, editingChapter.id]), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditingChapter(null);
                if (editFileInputRef.current) editFileInputRef.current.value = '';
                setFlash({ type: 'success', message: 'Bab berhasil diperbarui.' });
                setTimeout(() => setFlash(null), 3000);
            },
        });
    };

    // ─── Handlers: Delete ────────────────────────────────

    const handleDelete = (chapter: WorkChapter) => {
        if (!confirm(`Yakin ingin menghapus bab "${chapter.title}"? File PDF juga akan terhapus permanen.`)) return;
        
        setDeletingId(chapter.id);
        const { router } = require('@inertiajs/react');
        router.delete(route('admin.works.chapters.destroy', [work.id, chapter.id]), {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
            onSuccess: () => {
                setFlash({ type: 'success', message: 'Bab berhasil dihapus.' });
                setTimeout(() => setFlash(null), 3000);
            }
        });
    };

    const formatSize = (bytes: number | null) => {
        if (!bytes) return '—';
        return bytes >= 1024 * 1024
            ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
            : `${(bytes / 1024).toFixed(0)} KB`;
    };

    return (
        <AppLayout header={<h1 className="font-bold">Kelola Bab: {work.title}</h1>}>
            <Head title={`Kelola Bab - ${work.title}`} />

            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={route('admin.works.index')} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" /> Semua Karya
                </Link>
                <span>/</span>
                <Link href={route('admin.works.show', work.id)} className="hover:text-primary transition-colors line-clamp-1 max-w-[200px] sm:max-w-md">
                    {work.title}
                </Link>
                <span>/</span>
                <span className="font-medium text-foreground">Kelola Bab</span>
            </div>

            {/* Flash Info */}
            {flash && flash.type === 'success' && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {flash.message}
                </div>
            )}

            {/* Header */}
            <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">Kelola Bab Karya</h1>
                        <p className="mt-1 text-sm font-medium text-primary">{work.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Penulis: {work.author?.name} · Kategori: {work.category?.name}
                        </p>
                    </div>
                    {!showCreateForm && !editingChapter && (
                        <Button 
                            onClick={() => {
                                setShowCreateForm(true);
                                clearCreateErrors();
                            }} 
                            className="gap-2 shrink-0"
                        >
                            <Plus className="h-4 w-4" /> Tambah Bab
                        </Button>
                    )}
                </div>
            </div>

            {/* Form Create */}
            {showCreateForm && (
                <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                            <Plus className="h-4 w-4 text-primary" /> Tambah Bab Baru
                        </h2>
                        <button 
                            onClick={() => setShowCreateForm(false)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-4">
                            <div className="space-y-1.5 sm:col-span-1">
                                <Label htmlFor="chapter_number">Nomor Bab <span className="text-destructive">*</span></Label>
                                <Input
                                    id="chapter_number"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={createData.chapter_number}
                                    onChange={(e) => setCreateData('chapter_number', e.target.value)}
                                    placeholder="Contoh: 1"
                                    className={createErrors.chapter_number ? 'border-destructive ring-destructive/20' : ''}
                                />
                                {createErrors.chapter_number && <p className="text-xs font-medium text-destructive">{createErrors.chapter_number}</p>}
                            </div>
                            
                            <div className="space-y-1.5 sm:col-span-3">
                                <Label htmlFor="title">Judul Bab <span className="text-destructive">*</span></Label>
                                <Input
                                    id="title"
                                    value={createData.title}
                                    onChange={(e) => setCreateData('title', e.target.value)}
                                    placeholder="Contoh: Pendahuluan"
                                    className={createErrors.title ? 'border-destructive ring-destructive/20' : ''}
                                />
                                {createErrors.title && <p className="text-xs font-medium text-destructive">{createErrors.title}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description">Deskripsi Singkat</Label>
                            <Textarea
                                id="description"
                                rows={2}
                                value={createData.description}
                                onChange={(e) => setCreateData('description', e.target.value)}
                                placeholder="Opsional"
                                className="resize-none"
                            />
                            {createErrors.description && <p className="text-xs font-medium text-destructive">{createErrors.description}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="file">File PDF <span className="text-destructive">*</span></Label>
                            <Input
                                id="file"
                                type="file"
                                accept="application/pdf"
                                ref={fileInputRef}
                                onChange={(e) => setCreateData('file', e.target.files?.[0] || null)}
                                className={createErrors.file ? 'border-destructive ring-destructive/20' : ''}
                            />
                            <p className="text-xs text-muted-foreground">Maksimal 50 MB</p>
                            {createErrors.file && <p className="text-xs font-medium text-destructive">{createErrors.file}</p>}
                        </div>

                        <div className="pt-2">
                            <Button type="submit" disabled={createProcessing} className="gap-2">
                                <Save className="h-4 w-4" /> {createProcessing ? 'Menyimpan...' : 'Simpan Bab'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Form Edit */}
            {editingChapter && (
                <div className="mb-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                            <Edit className="h-4 w-4 text-yellow-600" /> Edit Bab
                        </h2>
                        <button 
                            onClick={() => setEditingChapter(null)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-4">
                            <div className="space-y-1.5 sm:col-span-1">
                                <Label htmlFor="edit_chapter_number">Nomor Bab <span className="text-destructive">*</span></Label>
                                <Input
                                    id="edit_chapter_number"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={editData.chapter_number}
                                    onChange={(e) => setEditData('chapter_number', e.target.value)}
                                    className={editErrors.chapter_number ? 'border-destructive ring-destructive/20' : ''}
                                />
                                {editErrors.chapter_number && <p className="text-xs font-medium text-destructive">{editErrors.chapter_number}</p>}
                            </div>
                            
                            <div className="space-y-1.5 sm:col-span-3">
                                <Label htmlFor="edit_title">Judul Bab <span className="text-destructive">*</span></Label>
                                <Input
                                    id="edit_title"
                                    value={editData.title}
                                    onChange={(e) => setEditData('title', e.target.value)}
                                    className={editErrors.title ? 'border-destructive ring-destructive/20' : ''}
                                />
                                {editErrors.title && <p className="text-xs font-medium text-destructive">{editErrors.title}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_description">Deskripsi Singkat</Label>
                            <Textarea
                                id="edit_description"
                                rows={2}
                                value={editData.description}
                                onChange={(e) => setEditData('description', e.target.value)}
                                className="resize-none"
                            />
                            {editErrors.description && <p className="text-xs font-medium text-destructive">{editErrors.description}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_file">Ganti File PDF</Label>
                            <Input
                                id="edit_file"
                                type="file"
                                accept="application/pdf"
                                ref={editFileInputRef}
                                onChange={(e) => setEditData('file', e.target.files?.[0] || null)}
                                className={editErrors.file ? 'border-destructive ring-destructive/20' : ''}
                            />
                            <p className="text-xs text-muted-foreground italic">Biarkan kosong jika tidak ingin mengganti file. Maksimal 50 MB.</p>
                            {editErrors.file && <p className="text-xs font-medium text-destructive">{editErrors.file}</p>}
                        </div>

                        <div className="pt-2 flex gap-3">
                            <Button type="submit" disabled={editProcessing} className="gap-2">
                                <Save className="h-4 w-4" /> {editProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setEditingChapter(null)}>
                                Batal
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Bab */}
            <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-center font-semibold text-muted-foreground w-20">Bab</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Judul & Deskripsi</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-32">Ukuran File</th>
                                <th className="px-4 py-3 text-center font-semibold text-muted-foreground w-40">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {chapters.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-16 text-center">
                                        <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                                        <p className="font-medium text-muted-foreground">Belum ada bab yang diunggah</p>
                                    </td>
                                </tr>
                            ) : (
                                chapters.map((chapter) => (
                                    <tr key={chapter.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                                {chapter.chapter_number}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-foreground">{chapter.title}</p>
                                            {chapter.description && (
                                                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 italic">{chapter.description}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {formatSize(chapter.file_size)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleEditClick(chapter)}
                                                    title="Edit"
                                                >
                                                    <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 border-destructive/20 text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(chapter)}
                                                    disabled={deletingId === chapter.id}
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
