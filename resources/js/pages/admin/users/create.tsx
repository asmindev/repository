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
        color: 'border-emerald-300 bg-emerald-50 text-emerald-700',
        activeColor: 'border-emerald-500 bg-emerald-100 ring-2 ring-emerald-300',
        iconColor: 'text-emerald-600',
    },
    {
        value: 'lecturer',
        label: 'Dosen',
        description: 'Dapat mereview dan menilai karya tulis mahasiswa',
        icon: UserCog,
        color: 'border-blue-300 bg-blue-50 text-blue-700',
        activeColor: 'border-blue-500 bg-blue-100 ring-2 ring-blue-300',
        iconColor: 'text-blue-600',
    },
    {
        value: 'admin',
        label: 'Admin',
        description: 'Akses penuh untuk mengelola sistem dan pengguna',
        icon: Shield,
        color: 'border-purple-300 bg-purple-50 text-purple-700',
        activeColor: 'border-purple-500 bg-purple-100 ring-2 ring-purple-300',
        iconColor: 'text-purple-600',
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
        <AppLayout title="Tambah Pengguna">
            <Head title="Tambah Pengguna - Repository KTI" />

            {/* ─── Breadcrumb ─────────────────────────────── */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link href={route('admin.users.index')} className="flex items-center gap-1.5 hover:text-blue-600">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Daftar Pengguna
                </Link>
                <span>/</span>
                <span className="font-medium text-gray-700">Tambah Pengguna</span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* ═══ Kolom Kiri: Form Utama ═══════════════════ */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* ── Informasi Dasar ───────────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                                <User className="h-4 w-4 text-blue-600" />
                                Informasi Dasar
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <FieldWrapper id="name" label="Nama Lengkap" error={errors.name} required>
                                        <div className="relative">
                                            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Masukkan nama lengkap"
                                                className={`pl-10 ${errors.name ? 'border-red-400' : ''}`}
                                                autoComplete="name"
                                                autoFocus
                                            />
                                        </div>
                                    </FieldWrapper>
                                </div>

                                <div className="sm:col-span-2">
                                    <FieldWrapper id="email" label="Alamat Email" error={errors.email} required>
                                        <div className="relative">
                                            <AtSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="contoh@email.com"
                                                className={`pl-10 ${errors.email ? 'border-red-400' : ''}`}
                                                autoComplete="email"
                                            />
                                        </div>
                                    </FieldWrapper>
                                </div>

                                <FieldWrapper id="nim" label="NIM" error={errors.nim} hint="Khusus mahasiswa">
                                    <div className="relative">
                                        <Hash className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="nim"
                                            type="text"
                                            value={data.nim}
                                            onChange={(e) => setData('nim', e.target.value)}
                                            placeholder="2021XXXXXX"
                                            className={`pl-10 ${errors.nim ? 'border-red-400' : ''}`}
                                            disabled={selectedRole !== 'student'}
                                        />
                                    </div>
                                </FieldWrapper>

                                <FieldWrapper id="nidn" label="NIDN" error={errors.nidn} hint="Khusus dosen">
                                    <div className="relative">
                                        <Hash className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="nidn"
                                            type="text"
                                            value={data.nidn}
                                            onChange={(e) => setData('nidn', e.target.value)}
                                            placeholder="XXXXXXXXXX"
                                            className={`pl-10 ${errors.nidn ? 'border-red-400' : ''}`}
                                            disabled={selectedRole !== 'lecturer'}
                                        />
                                    </div>
                                </FieldWrapper>

                                <FieldWrapper id="phone" label="No. Telepon" error={errors.phone}>
                                    <div className="relative">
                                        <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="08XXXXXXXXXX"
                                            className={`pl-10 ${errors.phone ? 'border-red-400' : ''}`}
                                        />
                                    </div>
                                </FieldWrapper>

                                <FieldWrapper id="department_id" label="Departemen / Prodi" error={errors.department_id}>
                                    <div className="relative">
                                        <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <select
                                            id="department_id"
                                            value={data.department_id}
                                            onChange={(e) => setData('department_id', e.target.value)}
                                            className={`w-full rounded-md border py-2 pr-4 pl-10 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                                                errors.department_id ? 'border-red-400' : 'border-gray-300'
                                            }`}
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
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                                <KeyRound className="h-4 w-4 text-blue-600" />
                                Kata Sandi
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FieldWrapper id="password" label="Password" error={errors.password} required hint="Minimal 8 karakter">
                                    <div className="relative">
                                        <KeyRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Min. 8 karakter"
                                            className={`pr-10 pl-10 ${errors.password ? 'border-red-400' : ''}`}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                        <KeyRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirm ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi password"
                                            className={`pr-10 pl-10 ${errors.password_confirmation ? 'border-red-400' : ''}`}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm((v) => !v)}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold text-gray-800">
                                Peran Pengguna <span className="ml-1 text-red-500">*</span>
                            </h2>
                            {errors.role && <p className="mb-3 text-xs font-medium text-red-600">{errors.role}</p>}
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
                                            className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                                                isSelected ? option.activeColor : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Icon
                                                    className={`mt-0.5 h-5 w-5 shrink-0 ${isSelected ? option.iconColor : 'text-gray-400'}`}
                                                />
                                                <div>
                                                    <p className={`text-sm font-semibold ${isSelected ? '' : 'text-gray-700'}`}>
                                                        {option.label}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-gray-500">{option.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Tombol Aksi ───────────────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
                                <Link href={route('admin.users.index')}>
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
                            <p className="mt-3 text-center text-xs text-gray-400">
                                Pengguna akan langsung aktif setelah dibuat
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
