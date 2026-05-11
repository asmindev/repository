// File: resources/js/pages/admin/work-categories/edit.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { WorkCategory } from '@/types/work-category';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Layers, Save } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────

interface Props {
    category: WorkCategory;
}

// ─── Main Page ────────────────────────────────────────────

export default function WorkCategoriesEdit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        slug: category.slug,
        has_supervisors: category.has_supervisors,
        can_download: category.can_download,
        description: category.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.work-categories.update', category.id));
    };

    return (
        <AppLayout title="Edit Kategori Karya">
            <Head title={`Edit ${category.name} - Repository KTI`} />

            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={route('admin.work-categories.index')} className="flex items-center gap-1.5 transition-colors hover:text-primary">
                    <ArrowLeft className="h-3.5 w-3.5" /> Kategori Karya
                </Link>
                <span>/</span>
                <span className="font-medium text-foreground">Edit: {category.name}</span>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Layers className="h-4 w-4" />
                        </div>
                        Edit Kategori
                    </h2>

                    <div className="space-y-4">
                        {/* Nama */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name">
                                Nama Kategori <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={errors.name ? 'border-destructive' : ''}
                                autoFocus
                            />
                            {errors.name && <p className="text-xs font-medium text-destructive">{errors.name}</p>}
                        </div>

                        {/* Slug */}
                        <div className="space-y-1.5">
                            <Label htmlFor="slug">
                                Slug <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                className={`font-mono text-sm ${errors.slug ? 'border-destructive' : ''}`}
                            />
                            {errors.slug && <p className="text-xs font-medium text-destructive">{errors.slug}</p>}
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-1.5">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                            {errors.description && <p className="text-xs font-medium text-destructive">{errors.description}</p>}
                        </div>

                        {/* Has Supervisors Toggle */}
                        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                                <Label htmlFor="has_supervisors" className="text-base">
                                    Membutuhkan Pembimbing
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Aktifkan jika karya dalam kategori ini wajib mencantumkan dosen pembimbing.
                                </p>
                            </div>
                            <Switch
                                id="has_supervisors"
                                checked={data.has_supervisors}
                                onCheckedChange={(checked) => setData('has_supervisors', checked)}
                            />
                        </div>

                        {/* Can Download Toggle */}
                        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                                <Label htmlFor="can_download" className="text-base">
                                    Bisa Diunduh Publik
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Aktifkan jika file pada kategori karya ini boleh didownload oleh publik (Non-Admin).
                                </p>
                            </div>
                            <Switch id="can_download" checked={data.can_download} onCheckedChange={(checked) => setData('can_download', checked)} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center gap-3 border-t pt-6">
                        <Button id="btn-submit-category-edit" type="submit" className="gap-2" disabled={processing}>
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                        <Link href={route('admin.work-categories.index')}>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
