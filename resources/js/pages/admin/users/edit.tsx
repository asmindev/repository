// File: resources/js/pages/admin/users/edit.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Department } from '@/types/department';
import type { User } from '@/types/user';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    AtSign,
    Building2,
    CheckCircle2,
    GraduationCap,
    Hash,
    Phone,
    Save,
    Shield,
    ToggleLeft,
    ToggleRight,
    User as UserIcon,
    UserCog,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────

// Spatie returns full role objects, not plain strings
interface SpatieRole {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot?: Record<string, unknown>;
}

interface UserWithRelations extends User {
    department?: Department;
    roles?: (SpatieRole | string)[];
}

function getRoleName(role: SpatieRole | string): string {
    return typeof role === 'string' ? role : role.name;
}

interface Props {
    user: UserWithRelations;
    departments: Pick<Department, 'id' | 'name'>[];
}

// ─── Role Options ─────────────────────────────────────────

const ROLE_OPTIONS = [
    {
        value: 'student',
        label: 'Mahasiswa',
        description: 'Dapat mengupload dan mengelola karya tulis sendiri',
        icon: GraduationCap,
        activeColor: 'border-emerald-500 bg-emerald-100 ring-2 ring-emerald-300',
        iconColor: 'text-emerald-600',
    },
    {
        value: 'lecturer',
        label: 'Dosen',
        description: 'Dapat mereview dan menilai karya tulis mahasiswa',
        icon: UserCog,
        activeColor: 'border-blue-500 bg-blue-100 ring-2 ring-blue-300',
        iconColor: 'text-blue-600',
    },
    {
        value: 'admin',
        label: 'Admin',
        description: 'Akses penuh untuk mengelola sistem dan pengguna',
        icon: Shield,
        activeColor: 'border-purple-500 bg-purple-100 ring-2 ring-purple-300',
        iconColor: 'text-purple-600',
    },
] as const;

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

export default function UsersEdit({ user, departments }: Props) {
    const currentRole = (() => {
        const raw = user.roles?.[0];
        if (!raw) return 'student';
        const name = getRoleName(raw);
        return (['student', 'lecturer', 'admin'].includes(name) ? name : 'student') as 'student' | 'lecturer' | 'admin';
    })();

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        nim: user.nim ?? '',
        nidn: user.nidn ?? '',
        phone: (user as User & { phone?: string }).phone ?? '',
        department_id: user.department_id ? String(user.department_id) : '',
        is_active: user.is_active,
        role: currentRole,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    const selectedRole = data.role;

    // Format tanggal
    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

    return (
        <AppLayout title="Edit Pengguna">
            <Head title={`Edit ${user.name} - Repository KTI`} />

            {/* ─── Breadcrumb ─────────────────────────────── */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link href={route('admin.users.index')} className="flex items-center gap-1.5 hover:text-blue-600">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Daftar Pengguna
                </Link>
                <span>/</span>
                <span className="font-medium text-gray-700">Edit: {user.name}</span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* ═══ Kolom Kiri: Form Utama ═══════════════════ */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* ── Informasi Dasar ───────────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                                <UserIcon className="h-4 w-4 text-blue-600" />
                                Informasi Dasar
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <FieldWrapper id="name" label="Nama Lengkap" error={errors.name} required>
                                        <div className="relative">
                                            <UserIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Nama lengkap pengguna"
                                                className={`pl-10 ${errors.name ? 'border-red-400' : ''}`}
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

                                <FieldWrapper
                                    id="department_id"
                                    label="Departemen / Prodi"
                                    error={errors.department_id}
                                >
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

                        {/* ── Status Akun ───────────────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold text-gray-800">Status Akun</h2>
                            <button
                                type="button"
                                id="toggle-is-active"
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`flex w-full items-center justify-between rounded-lg border-2 p-4 transition-all ${
                                    data.is_active
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-200 bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <CheckCircle2
                                        className={`h-5 w-5 ${data.is_active ? 'text-green-600' : 'text-gray-400'}`}
                                    />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-800">
                                            {data.is_active ? 'Akun Aktif' : 'Akun Nonaktif'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {data.is_active
                                                ? 'Pengguna dapat login dan mengakses sistem'
                                                : 'Pengguna tidak dapat login ke sistem'}
                                        </p>
                                    </div>
                                </div>
                                {data.is_active ? (
                                    <ToggleRight className="h-7 w-7 text-green-600" />
                                ) : (
                                    <ToggleLeft className="h-7 w-7 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ═══ Kolom Kanan ══════════════════════════════ */}
                    <div className="space-y-6">
                        {/* ── Info Akun ─────────────────────────── */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold text-gray-800">Info Akun</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-base font-bold text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-gray-900">{user.name}</p>
                                        <p className="truncate text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-500">
                                    <p>
                                        <span className="font-medium text-gray-600">ID:</span> #{user.id}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-600">Bergabung:</span>{' '}
                                        {formatDate(user.created_at)}
                                    </p>
                                    {user.department && (
                                        <p>
                                            <span className="font-medium text-gray-600">Prodi:</span>{' '}
                                            {user.department.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

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
                                                if (option.value !== 'student') setData('nim', '');
                                                if (option.value !== 'lecturer') setData('nidn', '');
                                            }}
                                            className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                                                isSelected
                                                    ? option.activeColor
                                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Icon
                                                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                                                        isSelected ? option.iconColor : 'text-gray-400'
                                                    }`}
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-700">{option.label}</p>
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
                                    id="btn-submit-edit-user"
                                    type="submit"
                                    className="w-full gap-2"
                                    disabled={processing}
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                                <Link href={route('admin.users.index')}>
                                    <Button
                                        id="btn-cancel-edit"
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                    >
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
