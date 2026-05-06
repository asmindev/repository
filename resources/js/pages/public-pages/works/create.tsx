import PublicLayout from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, GraduationCap, Send } from 'lucide-react';
import { ChapterForm } from '@/pages/admin/works/create/components/chapter-form';
import { DepartmentCombobox } from '@/pages/admin/works/create/components/department-combobox';
import { FieldWrapper } from '@/pages/admin/works/create/components/field-wrapper';
import { FileUploadZone } from '@/pages/admin/works/create/components/file-upload-zone';
import { CoverImageUpload } from '@/pages/admin/works/create/components/cover-image-upload';
import { SupervisorCombobox } from '@/pages/admin/works/create/components/supervisor-combobox';
import { CURRENT_YEAR } from '@/pages/admin/works/create/utils/constants';

interface Category {
    id: number;
    name: string;
    has_supervisors: boolean;
}

interface Department {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    nim?: string;
    nidn?: string;
}

interface WorksSubmitProps {
    categories: Category[];
    departments: Department[];
    supervisors: User[];
}

export default function SubmitWorkPage({ categories, departments, supervisors }: WorksSubmitProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: '',
        department_id: '',
        author_name: '',
        author_nim: '',
        supervisor_ids: [] as number[],
        title: '',
        abstract: '',
        keywords: '',
        year: String(CURRENT_YEAR),
        language: 'id',
        full_file: null as File | null,
        cover_image: null as File | null,
        chapters: [] as any[],
    });

    const addChapter = () => {
        setData('chapters', [...data.chapters, { id: Date.now().toString(), title: '', chapter_number: '', description: '', file: null }]);
    };

    const removeChapter = (id: string) => {
        setData('chapters', data.chapters.filter((c) => c.id !== id));
    };

    const updateChapter = (id: string, field: string, value: any) => {
        setData('chapters', data.chapters.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('works.submit.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout>
            <Head title="Kirim Karya Ilmiah - Repository KTI" />

            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="mb-8">
                    <Link href={route('home')} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
                    </Link>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Kirim Karya Ilmiah</h1>
                    <p className="mt-2 text-muted-foreground">
                        Kirimkan karya ilmiah Anda untuk dipublikasikan di repositori. Karya akan ditinjau terlebih dahulu sebelum diterbitkan.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* ═══ Kolom Kiri: Data Karya ═══════════════ */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* ── Informasi Utama ──────────────────── */}
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground/90">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    Informasi Karya
                                </h2>
                                <div className="space-y-5">
                                    <FieldWrapper id="title" label="Judul Karya" error={errors.title} required>
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
                                            rows={6}
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

                                    <div className="grid gap-5 sm:grid-cols-2">
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
                                <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground/90">
                                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                                    Penulis & Pembimbing
                                </h2>
                                <div className="space-y-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <FieldWrapper id="author_name" label="Nama Lengkap Penulis" error={errors.author_name} required>
                                            <Input
                                                id="author_name"
                                                value={data.author_name}
                                                onChange={(e) => setData('author_name', e.target.value)}
                                                placeholder="Contoh: Budi Santoso"
                                                className={errors.author_name ? 'border-destructive' : ''}
                                            />
                                        </FieldWrapper>
                                        
                                        <FieldWrapper id="author_nim" label="NIM / NIK" error={errors.author_nim} required>
                                            <Input
                                                id="author_nim"
                                                value={data.author_nim}
                                                onChange={(e) => setData('author_nim', e.target.value)}
                                                placeholder="Contoh: 123456789"
                                                className={errors.author_nim ? 'border-destructive' : ''}
                                            />
                                        </FieldWrapper>
                                    </div>

                                    {/* Conditionally show supervisors based on category */}
                                    {(!data.category_id || categories.find(c => c.id.toString() === data.category_id)?.has_supervisors) && (
                                        <FieldWrapper id="supervisor_ids" label="Dosen Pembimbing" error={errors.supervisor_ids as any} required>
                                            <SupervisorCombobox 
                                                supervisors={supervisors}
                                                selectedIds={data.supervisor_ids}
                                                onChange={(ids) => setData('supervisor_ids', ids)}
                                                error={errors.supervisor_ids as any}
                                            />
                                        </FieldWrapper>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <CoverImageUpload 
                                    file={data.cover_image}
                                    onChange={(file) => setData('cover_image', file)}
                                    error={errors.cover_image}
                                />
                                <FileUploadZone 
                                    file={data.full_file} 
                                    onChange={(file) => setData('full_file', file)} 
                                    error={errors.full_file}
                                />
                            </div>

                            <ChapterForm 
                                chapters={data.chapters}
                                onAdd={addChapter}
                                onRemove={removeChapter}
                                onUpdate={updateChapter}
                                errors={errors as any}
                            />
                        </div>

                        {/* ═══ Kolom Kanan: Klasifikasi & Aksi ═══════ */}
                        <div className="space-y-6">
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm sticky top-6">
                                <h2 className="mb-4 text-base font-semibold text-foreground/80">Klasifikasi</h2>
                                <div className="space-y-6">
                                    <FieldWrapper id="category_id" label="Kategori Karya" error={errors.category_id} required>
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
                                    
                                    <div className="pt-4 border-t border-border/40">
                                        <Button type="submit" className="w-full gap-2 h-11" disabled={processing}>
                                            <Send className="h-4 w-4" />
                                            {processing ? 'Mengirim...' : 'Kirim Karya Sekarang'}
                                        </Button>
                                        <p className="mt-3 text-center text-xs text-muted-foreground leading-relaxed">
                                            Karya yang dikirim akan berstatus <strong>Draft</strong> dan masuk ke dalam antrean moderasi. Anda dapat mengecek status karya Anda menggunakan NIM di kemudian hari.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
