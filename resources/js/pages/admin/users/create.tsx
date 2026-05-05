// File: resources/js/pages/admin/users/create.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Department } from '@/types/department';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    AtSign,
    Building2,
    Eye,
    EyeOff,
    GraduationCap,
    Hash,
    KeyRound,
    Phone,
    Save,
    Shield,
    User,
    UserCog,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────

interface Props {
    departments: Pick<Department, 'id' | 'name'>[];
}

// ─── Role Options ─────────────────────────────────────────

const ROLE_OPTIONS = [
    {
        value: 'student',
        label: 'Mahasiswa',
        description: 'Dapat mengupload dan mengelola karya tulis sendiri',
        icon: GraduationCap,
        className: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600',
        activeClassName: 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20',
        iconClassName: 'text-emerald-500',
    },
    {
        value: 'lecturer',
        label: 'Dosen',
        description: 'Dapat mereview dan menilai karya tulis mahasiswa',
        icon: UserCog,
        className: 'border-blue-500/20 bg-blue-500/5 text-blue-600',
        activeClassName: 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20',
        iconClassName: 'text-blue-500',
    },
    {
        value: 'admin',
        label: 'Admin',
        description: 'Akses penuh untuk mengelola sistem dan pengguna',
        icon: Shield,
        className: 'border-purple-500/20 bg-purple-500/5 text-purple-600',
        activeClassName: 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20',
        iconClassName: 'text-purple-500',
    },
] as const;

// ─── Field Components ─────────────────────────────────────

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
            <Label htmlFor={id} className="text-sm font-medium text-foreground/80">
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            {children}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────

export default function UsersCreate({ departments }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nim: '',
        nidn: '',
        phone: '',
        department_id: '',
        role: 'student' as 'student' | 'lecturer' | 'admin',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => reset(),
        });
    };

    const selectedRole = data.role;

    return (
        <AppLayout header={<h1 className="font-bold">Tambah Pengguna</h1>}>
            <Head title="Tambah Pengguna - Repository KTI" />

            {/* ─── Breadcrumb ─────────────────────────────── */}
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={route('admin.users.index')} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Daftar Pengguna
                </Link>
                <span>/</span>
                <span className="font-medium text-foreground">Tambah Pengguna</span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* ═══ Kolom Kiri: Form Utama ═══════════════════ */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* ── Informasi Dasar ───────────────────── */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
                                <User className="h-4 w-4 text-primary" />
                                Informasi Dasar
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <FieldWrapper id="name" label="Nama Lengkap" error={errors.name} required>
                                        <div className="relative">
                                            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Masukkan nama lengkap"
                                                className={cn("pl-10", errors.name && "border-destructive ring-destructive/20")}
                                                autoComplete="name"
                                                autoFocus
                                            />
                                        </div>
                                    </FieldWrapper>
                                </div>

                                <div className="sm:col-span-2">
                                    <FieldWrapper id="email" label="Alamat Email" error={errors.email} required>
                                        <div className="relative">
                                            <AtSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="contoh@email.com"
                                                className={cn("pl-10", errors.email && "border-destructive ring-destructive/20")}
                                                autoComplete="email"
                                            />
                                        </div>
                                    </FieldWrapper>
                                </div>

                                <FieldWrapper id="nim" label="NIM" error={errors.nim} hint="Khusus mahasiswa">
                                    <div className="relative">
                                        <Hash className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="nim"
                                            type="text"
                                            value={data.nim}
                                            onChange={(e) => setData('nim', e.target.value)}
                                            placeholder="2021XXXXXX"
                                            className={cn("pl-10", errors.nim && "border-destructive ring-destructive/20")}
                                            disabled={selectedRole !== 'student'}
                                        />
                                    </div>
                                </FieldWrapper>

                                <FieldWrapper id="nidn" label="NIDN" error={errors.nidn} hint="Khusus dosen">
                                    <div className="relative">
                                        <Hash className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="nidn"
                                            type="text"
                                            value={data.nidn}
                                            onChange={(e) => setData('nidn', e.target.value)}
                                            placeholder="XXXXXXXXXX"
                                            className={cn("pl-10", errors.nidn && "border-destructive ring-destructive/20")}
                                            disabled={selectedRole !== 'lecturer'}
                                        />
                                    </div>
                                </FieldWrapper>

                                <FieldWrapper id="phone" label="No. Telepon" error={errors.phone}>
                                    <div className="relative">
                                        <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="08XXXXXXXXXX"
                                            className={cn("pl-10", errors.phone && "border-destructive ring-destructive/20")}
                                        />
                                    </div>
                                </FieldWrapper>

                                <FieldWrapper id="department_id" label="Departemen / Prodi" error={errors.department_id}>
                                    <div className="relative">
                                        <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <select
                                            id="department_id"
                                            value={data.department_id}
                                            onChange={(e) => setData('department_id', e.target.value)}
                                            className={cn(
                                                "w-full rounded-md border bg-background py-2 pr-4 pl-10 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                                                errors.department_id ? "border-destructive" : "border-input"
                                            )}
                                        >
                                            <option value="">— Pilih Departemen —</option>
                                            {departments.map((dept) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </FieldWrapper>
                            </div>
                        </div>

                        {/* ── Password ──────────────────────────── */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
                                <KeyRound className="h-4 w-4 text-primary" />
                                Kata Sandi
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FieldWrapper id="password" label="Password" error={errors.password} required hint="Minimal 8 karakter">
                                    <div className="relative">
                                        <KeyRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Min. 8 karakter"
                                            className={cn("pr-10 pl-10", errors.password && "border-destructive ring-destructive/20")}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </FieldWrapper>

                                <FieldWrapper
                                    id="password_confirmation"
                                    label="Konfirmasi Password"
                                    error={errors.password_confirmation}
                                    required
                                >
                                    <div className="relative">
                                        <KeyRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirm ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi password"
                                            className={cn("pr-10 pl-10", errors.password_confirmation && "border-destructive ring-destructive/20")}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm((v) => !v)}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </FieldWrapper>
                            </div>
                        </div>
                    </div>

                    {/* ═══ Kolom Kanan: Role & Actions ══════════════ */}
                    <div className="space-y-6">
                        {/* ── Pilih Role ────────────────────────── */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold text-foreground">
                                Peran Pengguna <span className="ml-1 text-destructive">*</span>
                            </h2>
                            {errors.role && <p className="mb-3 text-xs font-medium text-destructive">{errors.role}</p>}
                            <div className="space-y-3">
                                {ROLE_OPTIONS.map((option) => {
                                    const isSelected = data.role === option.value;
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            id={`role-option-${option.value}`}
                                            onClick={() => {
                                                setData('role', option.value);
                                                // Reset NIM/NIDN jika role berubah
                                                if (option.value !== 'student') setData('nim', '');
                                                if (option.value !== 'lecturer') setData('nidn', '');
                                            }}
                                            className={cn(
                                                "w-full rounded-lg border-2 p-3 text-left transition-all",
                                                isSelected ? option.activeClassName : 'border-input bg-card hover:border-primary/30 hover:bg-muted/30'
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Icon
                                                    className={cn("mt-0.5 h-5 w-5 shrink-0 transition-colors", isSelected ? option.iconClassName : 'text-muted-foreground')}
                                                />
                                                <div>
                                                    <p className={cn("text-sm font-semibold transition-colors", isSelected ? 'text-foreground' : 'text-foreground/80')}>
                                                        {option.label}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">{option.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Tombol Aksi ───────────────────────── */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="space-y-3">
                                <Button
                                    id="btn-submit-create-user"
                                    type="submit"
                                    className="w-full gap-2"
                                    disabled={processing}
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                                </Button>
                                <Link href={route('admin.users.index')} className="block w-full">
                                    <Button
                                        id="btn-cancel-create"
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Batal
                                    </Button>
                                </Link>
                            </div>
                            <p className="mt-3 text-center text-[10px] text-muted-foreground uppercase tracking-widest">
                                Pengguna akan langsung aktif setelah dibuat
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
