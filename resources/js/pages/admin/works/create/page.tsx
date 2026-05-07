import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Globe, GraduationCap, Lock, Save } from 'lucide-react';
import { AuthorCombobox } from './components/author-combobox';
import { ChapterForm } from './components/chapter-form';
import { DepartmentCombobox } from './components/department-combobox';
import { FieldWrapper } from './components/field-wrapper';
import { FileUploadZone } from './components/file-upload-zone';
import { CoverImageUpload } from './components/cover-image-upload';
import { SupervisorCombobox } from './components/supervisor-combobox';
import { WorksCreateForm, WorksCreateProps } from './types';
import { CURRENT_YEAR } from './utils/constants';

export default function WorksCreatePage({ work, categories, departments, students, lecturers, supervisors }: WorksCreateProps) {
    const isEdit = !!work;

    const { data, setData, post, processing, errors, reset } = useForm<WorksCreateForm>({
        _method: isEdit ? 'PUT' : undefined,
        category_id: work?.category_id?.toString() ?? '',
        department_id: work?.department_id?.toString() ?? '',
        author_type: (work?.author?.nidn && !work?.author?.nim) ? 'lecturer' : 'student',
        author_id: work?.author_id?.toString() ?? '',
        author_identifier: (work?.author?.nidn && !work?.author?.nim) ? (work?.author?.nidn ?? '') : (work?.author?.nim ?? ''),
        supervisor_ids: work?.supervisors?.map(s => s.id.toString()) ?? [],
        title: work?.title ?? '',
        abstract: work?.abstract ?? '',
        keywords: work?.keywords?.join(', ') ?? '',
        year: work?.year?.toString() ?? String(CURRENT_YEAR),
        language: work?.language ?? 'id',
        visibility: work?.visibility ?? 'public',
        full_file: null,
        cover_image: null,
        chapters: work?.chapters?.map(c => ({
            id: c.id,
            title: c.title,
            chapter_number: c.chapter_number.toString(),
            description: c.description ?? '',
            file: null,
            file_url: c.file_path,
            file_size: c.file_size
        })) ?? [],
    });

    const addChapter = () => {
        setData('chapters', [...data.chapters, { id: Date.now().toString(), title: '', chapter_number: '', description: '', file: null }]);
    };

    const removeChapter = (id: string | number) => {
        setData('chapters', data.chapters.filter((c) => c.id !== id));
    };

    const updateChapter = (id: string | number, field: string, value: any) => {
        setData('chapters', data.chapters.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            post(route('admin.works.update', work.id), {
                forceFormData: true,
            });
        } else {
            post(route('admin.works.store'), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout header={<h1 className="font-bold uppercase italic text-primary">{isEdit ? 'Edit Dokumen' : 'Tambah Dokumen'}</h1>}>
            <Head title={isEdit ? `Edit: ${work.title} - Repository KTI` : 'Tambah Dokumen - Repository KTI'} />

            <div className="py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href={route('admin.works.index')} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <ArrowLeft className="h-3.5 w-3.5" /> Semua Dokumen
                        </Link>
                        <span>/</span>
                        <span className="font-medium text-foreground/70">{isEdit ? 'Edit Dokumen' : 'Tambah Baru'}</span>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* ═══ Kolom Kiri: Data Karya ═══════════════ */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* ── Informasi Utama ──────────────────── */}
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground/80">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    Informasi Dokumen
                                </h2>
                                <div className="space-y-4">
                                    <FieldWrapper id="title" label="Judul Dokumen" error={errors.title} required>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Masukkan judul lengkap karya tulis..."
                                            className={errors.title ? 'border-destructive' : ''}
                                            autoFocus
                                        />
                                    </FieldWrapper>

                                    <FieldWrapper id="abstract" label="Abstrak" error={errors.abstract} required>
                                        <Textarea
                                            id="abstract"
                                            value={data.abstract}
                                            onChange={(e) => setData('abstract', e.target.value)}
                                            placeholder="Tuliskan abstrak / ringkasan karya..."
                                            rows={5}
                                            className={errors.abstract ? 'border-destructive' : ''}
                                        />
                                    </FieldWrapper>

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
                                            className={errors.keywords ? 'border-destructive' : ''}
                                        />
                                    </FieldWrapper>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FieldWrapper id="year" label="Tahun" error={errors.year} required>
                                            <Input
                                                id="year"
                                                type="number"
                                                min={2000}
                                                max={CURRENT_YEAR + 1}
                                                value={data.year}
                                                onChange={(e) => setData('year', e.target.value)}
                                                className={errors.year ? 'border-destructive' : ''}
                                            />
                                        </FieldWrapper>

                                        <FieldWrapper id="language" label="Bahasa" error={errors.language} required>
                                            <Select value={data.language} onValueChange={(val) => setData('language', val)}>
                                                <SelectTrigger className={errors.language ? 'border-destructive' : ''}>
                                                    <SelectValue placeholder="Pilih Bahasa" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                                                    <SelectItem value="en">🇬🇧 English</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FieldWrapper>
                                    </div>
                                </div>
                            </div>

                            {/* ── Penulis & Pembimbing ──────────────── */}
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground/80">
                                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                                    Penulis & Pembimbing
                                </h2>
                                    <div className="space-y-4">
                                        <FieldWrapper id="author_type" label="Tipe Penulis" error={errors.author_type} required>
                                            <div className="flex space-x-1 bg-muted p-1 rounded-md">
                                                <button 
                                                    type="button"
                                                    onClick={() => setData('author_type', 'student')}
                                                    className={cn(
                                                        "flex-1 px-3 py-1.5 text-sm font-medium rounded-sm transition-all",
                                                        data.author_type === 'student' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/50"
                                                    )}
                                                >
                                                    Mahasiswa
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => setData('author_type', 'lecturer')}
                                                    className={cn(
                                                        "flex-1 px-3 py-1.5 text-sm font-medium rounded-sm transition-all",
                                                        data.author_type === 'lecturer' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/50"
                                                    )}
                                                >
                                                    Dosen
                                                </button>
                                            </div>
                                        </FieldWrapper>

                                        <FieldWrapper id="author_id" label={`Penulis (${data.author_type === 'student' ? 'Mahasiswa' : 'Dosen'})`} error={errors.author_id} required>
                                            <AuthorCombobox 
                                                authors={data.author_type === 'student' ? students : lecturers} 
                                                value={data.author_id} 
                                                onChange={(val) => setData('author_id', val)}
                                                error={errors.author_id}
                                                type={data.author_type}
                                            />
                                        </FieldWrapper>

                                        {(data.author_id && !(data.author_type === 'student' ? students : lecturers).some(a => a.id.toString() === data.author_id)) && (
                                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                <FieldWrapper 
                                                    id="author_identifier" 
                                                    label={`${data.author_type === 'student' ? 'NIM' : 'NIDN'} Penulis Baru`} 
                                                    error={errors.author_identifier} 
                                                    required
                                                >
                                                    <Input
                                                        id="author_identifier"
                                                        placeholder={`Masukkan ${data.author_type === 'student' ? 'NIM' : 'NIDN'}...`}
                                                        value={data.author_identifier}
                                                        onChange={(e) => setData('author_identifier', e.target.value)}
                                                        className={errors.author_identifier ? 'border-destructive' : ''}
                                                    />
                                                    <p className="mt-1 text-[10px] text-primary italic">
                                                        {data.author_type === 'student' ? 'Mahasiswa' : 'Dosen'} baru akan otomatis didaftarkan ke sistem.
                                                    </p>
                                                </FieldWrapper>
                                            </div>
                                        )}

                                        {/* Conditionally show supervisors based on category */}
                                        {data.author_type === 'student' && (!data.category_id || categories.find(c => c.id.toString() === data.category_id)?.has_supervisors) && (
                                            <FieldWrapper id="supervisor_ids" label="Dosen Pembimbing" error={errors.supervisor_ids} required>
                                                <SupervisorCombobox 
                                                    supervisors={supervisors}
                                                    selectedIds={data.supervisor_ids}
                                                    onChange={(ids) => setData('supervisor_ids', ids)}
                                                    error={errors.supervisor_ids}
                                                />
                                            </FieldWrapper>
                                        )}
                                    </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <CoverImageUpload 
                                    file={data.cover_image}
                                    existingUrl={work?.cover_image_path ? `/storage/${work.cover_image_path}` : undefined}
                                    onChange={(file) => setData('cover_image', file)}
                                    error={errors.cover_image}
                                    required={!work}
                                />
                                <FileUploadZone 
                                    file={data.full_file} 
                                    existingUrl={work?.full_file_path ? `/storage/${work.full_file_path}` : undefined}
                                    onChange={(file) => setData('full_file', file)} 
                                    error={errors.full_file}
                                    required={!work}
                                />
                            </div>

                            <ChapterForm 
                                chapters={data.chapters}
                                onAdd={addChapter}
                                onRemove={removeChapter}
                                onUpdate={updateChapter}
                                errors={errors}
                            />
                        </div>

                        {/* ═══ Kolom Kanan: Klasifikasi & Aksi ═══════ */}
                        <div className="space-y-6">
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h2 className="mb-4 text-base font-semibold text-foreground/80">Klasifikasi</h2>
                                <div className="space-y-4">
                                    <FieldWrapper id="category_id" label="Kategori Dokumen" error={errors.category_id} required>
                                        <Select
                                            value={data.category_id ? data.category_id.toString() : undefined}
                                            onValueChange={(val) => setData('category_id', val)}
                                        >
                                            <SelectTrigger className={errors.category_id ? 'border-destructive' : ''}>
                                                <SelectValue placeholder="— Pilih Kategori —" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((c) => (
                                                    <SelectItem key={c.id} value={c.id.toString()}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldWrapper>

                                    <FieldWrapper id="department_id" label="Departemen / Prodi" error={errors.department_id} required>
                                        <DepartmentCombobox 
                                            departments={departments}
                                            value={data.department_id}
                                            onChange={(val) => setData('department_id', val)}
                                            error={errors.department_id}
                                        />
                                    </FieldWrapper>
                                </div>
                            </div>

                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h2 className="mb-4 text-base font-semibold text-foreground/80">Visibilitas</h2>
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => setData('visibility', 'public')}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all",
                                            data.visibility === 'public'
                                                ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20'
                                                : 'border-border hover:border-border/80'
                                        )}
                                    >
                                        <Globe className={cn("h-5 w-5", data.visibility === 'public' ? 'text-emerald-600' : 'text-muted-foreground')} />
                                        <div>
                                            <p className="text-sm font-semibold text-foreground/90">Publik</p>
                                            <p className="text-xs text-muted-foreground">Dapat diakses semua orang</p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData('visibility', 'restricted')}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all",
                                            data.visibility === 'restricted'
                                                ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                                                : 'border-border hover:border-border/80'
                                        )}
                                    >
                                        <Lock className={cn("h-5 w-5", data.visibility === 'restricted' ? 'text-amber-600' : 'text-muted-foreground')} />
                                        <div>
                                            <p className="text-sm font-semibold text-foreground/90">Terbatas</p>
                                            <p className="text-xs text-muted-foreground">Hanya pengguna terdaftar</p>
                                        </div>
                                    </button>
                                </div>
                                {errors.visibility && <p className="mt-2 text-xs font-medium text-destructive">{errors.visibility}</p>}
                            </div>

                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <div className="space-y-3">
                                    <Button type="submit" className="w-full gap-2" disabled={processing}>
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Menyimpan...' : (isEdit ? 'Perbarui Dokumen' : 'Simpan sebagai Draft')}
                                    </Button>
                                    <p className="text-center text-[11px] text-muted-foreground">
                                        {isEdit ? 'Perubahan akan segera diterapkan' : 'Karya akan disimpan dengan status Draft'}
                                    </p>
                                    <Link href={route('admin.works.index')} className="block w-full">
                                        <Button type="button" variant="outline" className="w-full">
                                            Batal
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
