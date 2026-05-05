import AppLayout from '@/components/layouts/app-layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Faculty } from '@/types/department';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Save, X } from 'lucide-react';

interface Props {
    faculties: Pick<Faculty, 'id' | 'name'>[];
}

function toSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-');
}

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

            <div className="space-y-6">
                {/* Breadcrumb Section */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={route('admin.dashboard')}>Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={route('admin.departments.index')}>Departemen</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Tambah Baru</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="mx-auto max-w-2xl">
                    <Card className="">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle>Departemen Baru</CardTitle>
                                    <CardDescription>Tambahkan unit departemen atau program studi ke dalam sistem.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6">
                                    {/* Fakultas */}
                                    <div className="space-y-2">
                                        <Label htmlFor="faculty_id">Fakultas</Label>
                                        <Select value={data.faculty_id} onValueChange={(value) => setData('faculty_id', value)}>
                                            <SelectTrigger id="faculty_id" className={errors.faculty_id ? 'border-red-500 ring-red-200' : ''}>
                                                <SelectValue placeholder="Pilih Fakultas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {faculties.map((f) => (
                                                    <SelectItem key={f.id} value={f.id.toString()}>
                                                        {f.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.faculty_id && <p className="text-xs font-medium text-red-500">{errors.faculty_id}</p>}
                                    </div>

                                    {/* Nama Departemen */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Departemen</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => handleNameChange(e.target.value)}
                                            placeholder="Teknik Informatika"
                                            className={errors.name ? 'border-red-500' : ''}
                                            autoFocus
                                        />
                                        {errors.name && <p className="text-xs font-medium text-red-500">{errors.name}</p>}
                                    </div>

                                    {/* Slug */}
                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug URL</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            placeholder="teknik-informatika"
                                            className={`bg-gray-50/50 font-mono text-xs ${errors.slug ? 'border-red-500' : ''}`}
                                        />
                                        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                            Otomatis terisi berdasarkan nama
                                        </p>
                                        {errors.slug && <p className="text-xs font-medium text-red-500">{errors.slug}</p>}
                                    </div>

                                    {/* Deskripsi */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Deskripsi (Opsional)</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Tuliskan deskripsi singkat departemen..."
                                            className="min-h-[100px] resize-none"
                                        />
                                        {errors.description && <p className="text-xs font-medium text-red-500">{errors.description}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <Link href={route('admin.departments.index')}>
                                        <Button variant="destructive" type="button" className="gap-2">
                                            <X className="h-4 w-4" />
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="gap-2 px-6">
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Menyimpan...' : 'Simpan Departemen'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
