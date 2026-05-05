import AppLayout from '@/components/layouts/app-layout';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import type { Department, Faculty } from '@/types/department';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Building2, CheckCircle2, Edit, Plus, Save, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

// ─── Helpers ──────────────────────────────────────────────

function toSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-');
}

// ─── Types ───────────────────────────────────────────────

interface PaginatedDepartments {
    data: (Department & { faculty?: Faculty })[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    departments: PaginatedDepartments;
    filters: {
        search: string;
    };
}

// ─── Main Page ────────────────────────────────────────────

export default function DepartmentsIndex({ departments, filters }: Props) {
    const { props } = usePage<{ flash?: { success?: string; error?: string } }>();
    const flash = props.flash;

    const [search, setSearch] = useState(filters.search ?? '');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);

    // Form for Faculty
    const {
        data: facultyData,
        setData: setFacultyData,
        post: postFaculty,
        processing: processingFaculty,
        errors: facultyErrors,
        reset: resetFaculty,
    } = useForm({
        name: '',
        slug: '',
        description: '',
    });

    const handleFacultyNameChange = (value: string) => {
        setFacultyData((prev) => ({ ...prev, name: value, slug: toSlug(value) }));
    };

    const handleFacultySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postFaculty(route('admin.faculties.store'), {
            onSuccess: () => {
                resetFaculty();
                setIsFacultyModalOpen(false);
            },
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.departments.index'), search ? { search } : {}, { preserveState: true });
    };

    const handleDelete = (dept: Department) => {
        if (!confirm(`Yakin ingin menghapus departemen "${dept.name}"?`)) return;
        setDeletingId(dept.id);
        router.delete(route('admin.departments.destroy', dept.id), {
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Departemen - Repository KTI" />

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
                            <BreadcrumbPage>Departemen</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Flash Success */}
                {flash?.success && (
                    <div className="flex animate-in items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-600 shadow-sm fade-in slide-in-from-top-1">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Departemen / Program Studi</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Kelola struktur organisasi akademik dan unit program studi.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <AlertDialog open={isFacultyModalOpen} onOpenChange={setIsFacultyModalOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Tambah Fakultas
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="sm:max-w-[500px]">
                                <AlertDialogHeader>
                                    <div className="flex items-center gap-2 text-indigo-600">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                                            <Building2 className="h-4 w-4" />
                                        </div>
                                        <AlertDialogTitle>Tambah Fakultas</AlertDialogTitle>
                                    </div>
                                    <AlertDialogDescription>Masukkan data fakultas baru untuk mengelola struktur organisasi.</AlertDialogDescription>
                                </AlertDialogHeader>

                                <form onSubmit={handleFacultySubmit} className="space-y-4 py-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="faculty_name">Nama Fakultas</Label>
                                            <Input
                                                id="faculty_name"
                                                value={facultyData.name}
                                                onChange={(e) => handleFacultyNameChange(e.target.value)}
                                                placeholder="Contoh: Fakultas Ilmu Komputer"
                                                className={facultyErrors.name ? 'border-red-500 ring-red-100' : ''}
                                                autoFocus
                                            />
                                            {facultyErrors.name && <p className="text-xs font-medium text-red-500">{facultyErrors.name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="faculty_slug">Slug URL</Label>
                                            <Input
                                                id="faculty_slug"
                                                value={facultyData.slug}
                                                onChange={(e) => setFacultyData('slug', e.target.value)}
                                                placeholder="fakultas-ilmu-komputer"
                                                className={`bg-gray-50 font-mono text-xs ${facultyErrors.slug ? 'border-red-500 ring-red-100' : ''}`}
                                            />
                                            {facultyErrors.slug && <p className="text-xs font-medium text-red-500">{facultyErrors.slug}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="faculty_description">Deskripsi (Opsional)</Label>
                                            <Textarea
                                                id="faculty_description"
                                                value={facultyData.description}
                                                onChange={(e) => setFacultyData('description', e.target.value)}
                                                placeholder="Tuliskan deskripsi singkat fakultas..."
                                                className="min-h-[100px] resize-none"
                                            />
                                            {facultyErrors.description && (
                                                <p className="text-xs font-medium text-red-500">{facultyErrors.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <AlertDialogFooter className="-mx-6 mt-6 -mb-6 bg-gray-50/50 p-6">
                                        <AlertDialogCancel type="button" variant="ghost">
                                            Batal
                                        </AlertDialogCancel>
                                        <Button type="submit" disabled={processingFaculty} className="gap-2 px-6">
                                            <Save className="h-4 w-4" />
                                            {processingFaculty ? 'Menyimpan...' : 'Simpan Fakultas'}
                                        </Button>
                                    </AlertDialogFooter>
                                </form>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Link href={route('admin.departments.create')}>
                            <Button className="gap-2 shadow-sm">
                                <Plus className="h-4 w-4" />
                                Tambah Departemen
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <form onSubmit={handleSearch} className="relative flex w-full max-w-sm items-center gap-2">
                        <div className="relative w-full">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Cari departemen..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                        </div>
                        <Button type="submit" variant="secondary" size="sm">
                            Cari
                        </Button>
                    </form>

                    <div className="text-xs text-muted-foreground">
                        Menampilkan{' '}
                        <span className="font-medium text-foreground">
                            {departments.from ?? 0}-{departments.to ?? 0}
                        </span>{' '}
                        dari <span className="font-medium text-foreground">{departments.total}</span> departemen
                    </div>
                </div>

                {/* Table Container */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[300px]">Nama Departemen</TableHead>
                                <TableHead className="hidden md:table-cell">Fakultas</TableHead>
                                <TableHead className="hidden lg:table-cell">Slug</TableHead>
                                <TableHead className="hidden w-[300px] xl:table-cell">Deskripsi</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Building2 className="h-10 w-10 text-muted-foreground/30" />
                                            <p className="text-sm font-medium text-muted-foreground">Belum ada data departemen.</p>
                                            <Link href={route('admin.departments.create')}>
                                                <Button variant="link" size="sm">
                                                    Buat departemen pertama
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                departments.data.map((dept) => (
                                    <TableRow key={dept.id} className="group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                                                    <Building2 className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground">{dept.name}</span>
                                                    <span className="text-[10px] tracking-wider text-muted-foreground uppercase md:hidden">
                                                        {dept.faculty?.name ?? 'Tanpa Fakultas'}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge variant="outline" className="font-medium">
                                                {dept.faculty?.name ?? '—'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                                {dept.slug}
                                            </code>
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            <span className="line-clamp-1 text-xs text-muted-foreground">{dept.description ?? '—'}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('admin.departments.edit', dept.id)}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-indigo-600"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleDelete(dept)}
                                                    disabled={deletingId === dept.id}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Hapus</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {departments.last_page > 1 && (
                        <div className="flex items-center justify-center border-t p-4">
                            <Pagination>
                                <PaginationContent>
                                    {departments.links.map((link, i) => {
                                        // Skip mapping if label is just numbers, we handle standard prev/next/links
                                        const isPrev = link.label.includes('Previous');
                                        const isNext = link.label.includes('Next');

                                        return (
                                            <PaginationItem key={i}>
                                                {isPrev ? (
                                                    <PaginationPrevious
                                                        href={link.url ?? '#'}
                                                        className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                ) : isNext ? (
                                                    <PaginationNext
                                                        href={link.url ?? '#'}
                                                        className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                ) : (
                                                    <PaginationLink
                                                        href={link.url ?? '#'}
                                                        isActive={link.active}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )}
                                            </PaginationItem>
                                        );
                                    })}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
