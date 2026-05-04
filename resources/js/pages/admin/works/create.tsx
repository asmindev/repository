// File: resources/js/pages/admin/works/create.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Department } from '@/types/department';
import type { User } from '@/types/user';
import type { WorkCategory } from '@/types/work-category';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    FileUp,
    Globe,
    GraduationCap,
    Lock,
    Plus,
    Save,
    Trash2,
    Upload,
    UserCog,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';

// ─── Types ───────────────────────────────────────────────

interface AuthorOption {
    id: number;
    name: string;
    nim: string | null;
}

interface SupervisorOption {
    id: number;
    name: string;
    nidn: string | null;
}

interface Props {
    categories: Pick<WorkCategory, 'id' | 'name'>[];
    departments: Pick<Department, 'id' | 'name'>[];
    authors: AuthorOption[];
    supervisors: SupervisorOption[];
}

// ─── Constants ────────────────────────────────────────────

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = ['application/pdf'];
const CURRENT_YEAR = new Date().getFullYear();

// ─── Field Wrapper ────────────────────────────────────────

function FieldWrapper({
    id,
    label,
    error,
    required,
    hint,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </Label>
            {children}
            {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────

export default function WorksCreate({ categories, departments, authors, supervisors }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        category_id: string;
        department_id: string;
        author_id: string;
        supervisor_id: string;
        title: string;
        abstract: string;
        keywords: string;
        year: string;
        language: string;
        visibility: string;
        full_file: File | null;
        chapters: Array<{
            id: string; // unique ID for React keys
            title: string;
            chapter_number: string;
            description: string;
            file: File | null;
        }>;
    }>({
        category_id: '',
        department_id: '',
        author_id: '',
        supervisor_id: '',
        title: '',
        abstract: '',
        keywords: '',
        year: String(CURRENT_YEAR),
        language: 'id',
        visibility: 'public',
        full_file: null,
        chapters: [],
    });

    const addChapter = () => {
        setData('chapters', [
            ...data.chapters,
            { id: Date.now().toString(), title: '', chapter_number: '', description: '', file: null }
        ]);
    };

    const removeChapter = (id: string) => {
        setData('chapters', data.chapters.filter(c => c.id !== id));
    };

    const updateChapter = (id: string, field: string, value: any) => {
        setData('chapters', data.chapters.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError(null);

        if (!file) {
            setData('full_file', null);
            setSelectedFileName(null);
            return;
        }

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            setFileError('Hanya file PDF yang diperbolehkan.');
            e.target.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setFileError('Ukuran file maksimal 50 MB.');
            e.target.value = '';
            return;
        }

        setData('full_file', file);
        setSelectedFileName(file.name);
    };

    const removeFile = () => {
        setData('full_file', null);
        setSelectedFileName(null);
        setFileError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.works.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout header={<h1 className="font-bold">Tambah Karya</h1>}>
            <Head title="Tambah Karya - Repository KTI" />

            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link href={route('admin.works.index')} className="flex items-center gap-1.5 hover:text-blue-600">
                    <ArrowLeft className="h-3.5 w-3.5" /> Semua Karya
                </Link>
                <span>/</span>
                <span className="font-medium text-gray-700">Tambah Baru</span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* ═══ Kolom Kiri: Data Karya ═══════════════ */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* ── Informasi Utama ──────────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                                <BookOpen className="h-4 w-4 text-blue-600" />
                                Informasi Karya
                            </h2>
                            <div className="space-y-4">
                                {/* Judul */}
                                <FieldWrapper id="title" label="Judul Karya" error={errors.title} required>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Masukkan judul lengkap karya tulis..."
                                        className={errors.title ? 'border-red-400' : ''}
                                        autoFocus
                                    />
                                </FieldWrapper>

                                {/* Abstrak */}
                                <FieldWrapper id="abstract" label="Abstrak" error={errors.abstract} required>
                                    <Textarea
                                        id="abstract"
                                        value={data.abstract}
                                        onChange={(e) => setData('abstract', e.target.value)}
                                        placeholder="Tuliskan abstrak / ringkasan karya..."
                                        rows={5}
                                        className={errors.abstract ? 'border-red-400' : ''}
                                    />
                                </FieldWrapper>

                                {/* Keywords */}
                                <FieldWrapper
                                    id="keywords"
                                    label="Kata Kunci"
                                    error={errors.keywords}
                                    required
                                    hint="Pisahkan dengan koma, contoh: machine learning, neural network, NLP"
                                >
                                    <Input
                                        id="keywords"
                                        value={data.keywords}
                                        onChange={(e) => setData('keywords', e.target.value)}
                                        placeholder="kata kunci 1, kata kunci 2, kata kunci 3"
                                        className={errors.keywords ? 'border-red-400' : ''}
                                    />
                                </FieldWrapper>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* Tahun */}
                                    <FieldWrapper id="year" label="Tahun" error={errors.year} required>
                                        <Input
                                            id="year"
                                            type="number"
                                            min={2000}
                                            max={CURRENT_YEAR + 1}
                                            value={data.year}
                                            onChange={(e) => setData('year', e.target.value)}
                                            className={errors.year ? 'border-red-400' : ''}
                                        />
                                    </FieldWrapper>

                                    {/* Bahasa */}
                                    <FieldWrapper id="language" label="Bahasa" error={errors.language} required>
                                        <select
                                            id="language"
                                            value={data.language}
                                            onChange={(e) => setData('language', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >
                                            <option value="id">🇮🇩 Bahasa Indonesia</option>
                                            <option value="en">🇬🇧 English</option>
                                        </select>
                                    </FieldWrapper>
                                </div>
                            </div>
                        </div>

                        {/* ── Penulis & Pembimbing ──────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                                <GraduationCap className="h-4 w-4 text-emerald-600" />
                                Penulis & Pembimbing
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Penulis */}
                                <FieldWrapper id="author_id" label="Penulis (Mahasiswa)" error={errors.author_id} required>
                                    <select
                                        id="author_id"
                                        value={data.author_id}
                                        onChange={(e) => setData('author_id', e.target.value)}
                                        className={`w-full rounded-md border bg-white py-2 px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                                            errors.author_id ? 'border-red-400' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">— Pilih Penulis —</option>
                                        {authors.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name} {a.nim ? `(${a.nim})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </FieldWrapper>

                                {/* Pembimbing */}
                                <FieldWrapper id="supervisor_id" label="Dosen Pembimbing" error={errors.supervisor_id}>
                                    <select
                                        id="supervisor_id"
                                        value={data.supervisor_id}
                                        onChange={(e) => setData('supervisor_id', e.target.value)}
                                        className={`w-full rounded-md border bg-white py-2 px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                                            errors.supervisor_id ? 'border-red-400' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">— Pilih Pembimbing (opsional) —</option>
                                        {supervisors.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} {s.nidn ? `(${s.nidn})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </FieldWrapper>
                            </div>
                        </div>

                        {/* ── Upload File ───────────────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                                <FileUp className="h-4 w-4 text-orange-600" />
                                File Karya (PDF)
                            </h2>

                            {!selectedFileName ? (
                                <label
                                    htmlFor="full_file"
                                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition-colors hover:border-blue-400 hover:bg-blue-50"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                        <Upload className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-700">
                                            Klik untuk memilih file PDF
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">Maksimal 50 MB · Hanya format PDF</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        id="full_file"
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            ) : (
                                <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
                                            <FileUp className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{selectedFileName}</p>
                                            <p className="text-xs text-gray-500">
                                                {data.full_file
                                                    ? `${(data.full_file.size / (1024 * 1024)).toFixed(1)} MB`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {(fileError || errors.full_file) && (
                                <p className="mt-2 text-xs font-medium text-red-600">
                                    {fileError || errors.full_file}
                                </p>
                            )}
                        </div>

                        {/* ── Upload Chapters (Opsional) ──────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                                    <BookOpen className="h-4 w-4 text-blue-600" />
                                    Daftar Bab (Opsional)
                                </h2>
                                <Button type="button" onClick={addChapter} variant="outline" size="sm" className="gap-1 border-blue-200 text-blue-700 hover:bg-blue-50">
                                    <Plus className="h-3.5 w-3.5" /> Tambah Bab
                                </Button>
                            </div>
                            
                            {data.chapters.length === 0 ? (
                                <div className="text-center py-6 text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg">
                                    Belum ada bab yang ditambahkan. <button type="button" onClick={addChapter} className="text-blue-600 font-medium hover:underline">Tambah sekarang</button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {data.chapters.map((chapter, index) => (
                                        <div key={chapter.id} className="relative rounded-lg border border-gray-200 bg-gray-50 p-4 pt-5">
                                            <button
                                                type="button"
                                                onClick={() => removeChapter(chapter.id)}
                                                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                            
                                            <div className="grid gap-4 sm:grid-cols-4">
                                                <div className="space-y-1.5 sm:col-span-1">
                                                    <Label>No. Bab <span className="text-red-500">*</span></Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="20"
                                                        value={chapter.chapter_number}
                                                        onChange={(e) => updateChapter(chapter.id, 'chapter_number', e.target.value)}
                                                        placeholder="1"
                                                    />
                                                    {/* Using type assertions loosely here for errors, normally we'd check errors[`chapters.${index}.chapter_number`] */}
                                                    {(errors as any)[`chapters.${index}.chapter_number`] && (
                                                        <p className="text-[10px] text-red-600">{(errors as any)[`chapters.${index}.chapter_number`]}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1.5 sm:col-span-3">
                                                    <Label>Judul Bab <span className="text-red-500">*</span></Label>
                                                    <Input
                                                        value={chapter.title}
                                                        onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                                                        placeholder="Pendahuluan"
                                                    />
                                                    {(errors as any)[`chapters.${index}.title`] && (
                                                        <p className="text-[10px] text-red-600">{(errors as any)[`chapters.${index}.title`]}</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="mt-3 grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-1.5">
                                                    <Label>Deskripsi (Opsional)</Label>
                                                    <Textarea
                                                        rows={2}
                                                        value={chapter.description}
                                                        onChange={(e) => updateChapter(chapter.id, 'description', e.target.value)}
                                                    />
                                                    {(errors as any)[`chapters.${index}.description`] && (
                                                        <p className="text-[10px] text-red-600">{(errors as any)[`chapters.${index}.description`]}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label>File PDF <span className="text-red-500">*</span></Label>
                                                    <Input
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={(e) => updateChapter(chapter.id, 'file', e.target.files?.[0] || null)}
                                                    />
                                                    <p className="text-[10px] text-gray-500">Maks. 50 MB</p>
                                                    {(errors as any)[`chapters.${index}.file`] && (
                                                        <p className="text-[10px] text-red-600">{(errors as any)[`chapters.${index}.file`]}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ═══ Kolom Kanan: Klasifikasi & Aksi ═══════ */}
                    <div className="space-y-6">
                        {/* ── Klasifikasi ───────────────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold text-gray-800">Klasifikasi</h2>
                            <div className="space-y-4">
                                {/* Kategori */}
                                <FieldWrapper id="category_id" label="Kategori Karya" error={errors.category_id} required>
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className={`w-full rounded-md border bg-white py-2 px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                                            errors.category_id ? 'border-red-400' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">— Pilih Kategori —</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </FieldWrapper>

                                {/* Departemen */}
                                <FieldWrapper id="department_id" label="Departemen / Prodi" error={errors.department_id} required>
                                    <select
                                        id="department_id"
                                        value={data.department_id}
                                        onChange={(e) => setData('department_id', e.target.value)}
                                        className={`w-full rounded-md border bg-white py-2 px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                                            errors.department_id ? 'border-red-400' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">— Pilih Departemen —</option>
                                        {departments.map((d) => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </FieldWrapper>
                            </div>
                        </div>

                        {/* ── Visibilitas ───────────────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold text-gray-800">Visibilitas</h2>
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    id="visibility-public"
                                    onClick={() => setData('visibility', 'public')}
                                    className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                                        data.visibility === 'public'
                                            ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <Globe className={`h-5 w-5 ${data.visibility === 'public' ? 'text-emerald-600' : 'text-gray-400'}`} />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Publik</p>
                                        <p className="text-xs text-gray-500">Dapat diakses semua orang</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    id="visibility-restricted"
                                    onClick={() => setData('visibility', 'restricted')}
                                    className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                                        data.visibility === 'restricted'
                                            ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <Lock className={`h-5 w-5 ${data.visibility === 'restricted' ? 'text-amber-600' : 'text-gray-400'}`} />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Terbatas</p>
                                        <p className="text-xs text-gray-500">Hanya pengguna terdaftar</p>
                                    </div>
                                </button>
                            </div>
                            {errors.visibility && <p className="mt-2 text-xs font-medium text-red-600">{errors.visibility}</p>}
                        </div>

                        {/* ── Tombol Aksi ───────────────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="space-y-3">
                                <Button
                                    id="btn-submit-work"
                                    type="submit"
                                    className="w-full gap-2"
                                    disabled={processing}
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan sebagai Draft'}
                                </Button>
                                <p className="text-center text-[11px] text-gray-400">
                                    Karya akan disimpan dengan status <strong>Draft</strong>
                                </p>
                                <Link href={route('admin.works.index')}>
                                    <Button type="button" variant="outline" className="w-full">
                                        Batal
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
