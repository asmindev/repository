// File: resources/js/pages/admin/departments/create.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Faculty } from '@/types/department';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Save } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────

interface Props {
    faculties: Pick<Faculty, 'id' | 'name'>[];
}

// ─── Slug generator ──────────────────────────────────────

function toSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-');
}

// ─── Main Page ────────────────────────────────────────────

export default function DepartmentsCreate({ faculties }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        faculty_id: '',
        name: '',
        slug: '',
        description: '',
    });

    const handleNameChange = (value: string) => {
        setData((prev) => ({ ...prev, name: value, slug: toSlug(value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.departments.store'), { onSuccess: () => reset() });
    };

    return (
        <AppLayout title="Tambah Departemen">
            <Head title="Tambah Departemen - Repository KTI" />

            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link href={route('admin.departments.index')} className="flex items-center gap-1.5 hover:text-blue-600">
                    <ArrowLeft className="h-3.5 w-3.5" /> Departemen
                </Link>
                <span>/</span>
                <span className="font-medium text-gray-700">Tambah Baru</span>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                        <Building2 className="h-4 w-4 text-indigo-600" />
                        Informasi Departemen
                    </h2>

                    <div className="space-y-4">
                        {/* Fakultas */}
                        <div className="space-y-1.5">
                            <Label htmlFor="faculty_id">
                                Fakultas <span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="faculty_id"
                                value={data.faculty_id}
                                onChange={(e) => setData('faculty_id', e.target.value)}
                                className={`w-full rounded-md border py-2 px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                                    errors.faculty_id ? 'border-red-400' : 'border-gray-300'
                                }`}
                            >
                                <option value="">— Pilih Fakultas —</option>
                                {faculties.map((f) => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </select>
                            {errors.faculty_id && <p className="text-xs font-medium text-red-600">{errors.faculty_id}</p>}
                        </div>

                        {/* Nama */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name">
                                Nama Departemen <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Contoh: Teknik Informatika"
                                className={errors.name ? 'border-red-400' : ''}
                                autoFocus
                            />
                            {errors.name && <p className="text-xs font-medium text-red-600">{errors.name}</p>}
                        </div>

                        {/* Slug */}
                        <div className="space-y-1.5">
                            <Label htmlFor="slug">
                                Slug <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                placeholder="teknik-informatika"
                                className={`font-mono text-sm ${errors.slug ? 'border-red-400' : ''}`}
                            />
                            <p className="text-xs text-gray-400">Otomatis terisi dari nama, bisa diedit manual</p>
                            {errors.slug && <p className="text-xs font-medium text-red-600">{errors.slug}</p>}
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-1.5">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Deskripsi singkat departemen (opsional)"
                                rows={3}
                            />
                            {errors.description && <p className="text-xs font-medium text-red-600">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-6">
                        <Button id="btn-submit-department" type="submit" className="gap-2" disabled={processing}>
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Departemen'}
                        </Button>
                        <Link href={route('admin.departments.index')}>
                            <Button type="button" variant="outline">Batal</Button>
                        </Link>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
