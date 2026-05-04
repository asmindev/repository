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
            _method: 'POST', // because Laravel requires POST for file uploads with method spoofing, but actually we will spoof later if needed. Wait, Inertia supports method spoofing by setting _method: 'PUT' on a POST request or just passing file via POST and defining route as POST. I defined route as POST `Route::post('/works/{work}/chapters/{chapter}', ... 'update')` so we just use standard POST. Wait! I defined update route as POST so we don't need `_method` spoofing.
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
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link href={route('admin.works.index')} className="flex items-center gap-1.5 hover:text-blue-600">
                    <ArrowLeft className="h-3.5 w-3.5" /> Semua Karya
                </Link>
                <span>/</span>
                <Link href={route('admin.works.show', work.id)} className="hover:text-blue-600 line-clamp-1 max-w-[200px] sm:max-w-md">
                    {work.title}
                </Link>
                <span>/</span>
                <span className="font-medium text-gray-700">Kelola Bab</span>
            </div>

            {/* Flash Info */}
            {flash && flash.type === 'success' && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {flash.message}
                </div>
            )}

            {/* Header */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">Kelola Bab Karya</h1>
                        <p className="mt-1 text-sm font-medium text-blue-700">{work.title}</p>
                        <p className="mt-1 text-xs text-gray-500">
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
                <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                            <Plus className="h-4 w-4 text-blue-600" /> Tambah Bab Baru
                        </h2>
                        <button 
                            onClick={() => setShowCreateForm(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-4">
                            <div className="space-y-1.5 sm:col-span-1">
                                <Label htmlFor="chapter_number">Nomor Bab <span className="text-red-500">*</span></Label>
                                <Input
                                    id="chapter_number"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={createData.chapter_number}
                                    onChange={(e) => setCreateData('chapter_number', e.target.value)}
                                    placeholder="Contoh: 1"
                                    className={createErrors.chapter_number ? 'border-red-400' : ''}
                                />
                                {createErrors.chapter_number && <p className="text-xs text-red-600">{createErrors.chapter_number}</p>}
                            </div>
                            
                            <div className="space-y-1.5 sm:col-span-3">
                                <Label htmlFor="title">Judul Bab <span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    value={createData.title}
                                    onChange={(e) => setCreateData('title', e.target.value)}
                                    placeholder="Contoh: Pendahuluan"
                                    className={createErrors.title ? 'border-red-400' : ''}
                                />
                                {createErrors.title && <p className="text-xs text-red-600">{createErrors.title}</p>}
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
                            />
                            {createErrors.description && <p className="text-xs text-red-600">{createErrors.description}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="file">File PDF <span className="text-red-500">*</span></Label>
                            <Input
                                id="file"
                                type="file"
                                accept="application/pdf"
                                ref={fileInputRef}
                                onChange={(e) => setCreateData('file', e.target.files?.[0] || null)}
                                className={createErrors.file ? 'border-red-400' : ''}
                            />
                            <p className="text-xs text-gray-500">Maksimal 50 MB</p>
                            {createErrors.file && <p className="text-xs text-red-600">{createErrors.file}</p>}
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
                <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50/30 p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                            <Edit className="h-4 w-4 text-amber-600" /> Edit Bab
                        </h2>
                        <button 
                            onClick={() => setEditingChapter(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-4">
                            <div className="space-y-1.5 sm:col-span-1">
                                <Label htmlFor="edit_chapter_number">Nomor Bab <span className="text-red-500">*</span></Label>
                                <Input
                                    id="edit_chapter_number"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={editData.chapter_number}
                                    onChange={(e) => setEditData('chapter_number', e.target.value)}
                                    className={editErrors.chapter_number ? 'border-red-400' : ''}
                                />
                                {editErrors.chapter_number && <p className="text-xs text-red-600">{editErrors.chapter_number}</p>}
                            </div>
                            
                            <div className="space-y-1.5 sm:col-span-3">
                                <Label htmlFor="edit_title">Judul Bab <span className="text-red-500">*</span></Label>
                                <Input
                                    id="edit_title"
                                    value={editData.title}
                                    onChange={(e) => setEditData('title', e.target.value)}
                                    className={editErrors.title ? 'border-red-400' : ''}
                                />
                                {editErrors.title && <p className="text-xs text-red-600">{editErrors.title}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_description">Deskripsi Singkat</Label>
                            <Textarea
                                id="edit_description"
                                rows={2}
                                value={editData.description}
                                onChange={(e) => setEditData('description', e.target.value)}
                            />
                            {editErrors.description && <p className="text-xs text-red-600">{editErrors.description}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_file">Ganti File PDF</Label>
                            <Input
                                id="edit_file"
                                type="file"
                                accept="application/pdf"
                                ref={editFileInputRef}
                                onChange={(e) => setEditData('file', e.target.files?.[0] || null)}
                                className={editErrors.file ? 'border-red-400' : ''}
                            />
                            <p className="text-xs text-gray-500">Biarkan kosong jika tidak ingin mengganti file. Maksimal 50 MB.</p>
                            {editErrors.file && <p className="text-xs text-red-600">{editErrors.file}</p>}
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
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-4 py-3 text-center font-semibold text-gray-600 w-20">Bab</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Judul & Deskripsi</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-32">Ukuran File</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-600 w-40">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {chapters.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-16 text-center">
                                        <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                                        <p className="font-medium text-gray-400">Belum ada bab yang diupload</p>
                                    </td>
                                </tr>
                            ) : (
                                chapters.map((chapter) => (
                                    <tr key={chapter.id} className="transition-colors hover:bg-gray-50">
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                                {chapter.chapter_number}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-gray-900">{chapter.title}</p>
                                            {chapter.description && (
                                                <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{chapter.description}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500">
                                            {formatSize(chapter.file_size)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="gap-1"
                                                    onClick={() => handleEditClick(chapter)}
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(chapter)}
                                                    disabled={deletingId === chapter.id}
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
