// File: resources/js/pages/profile/edit.tsx

import AppLayout from '@/components/layouts/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { User } from '@/types/user';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Building2,
    Camera,
    Hash,
    KeyRound,
    Mail,
    Phone,
    Save,
    User as UserIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    user: User;
    status?: string;
}

export default function ProfileEdit({ user, status }: Props) {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar ? `/storage/${user.avatar}` : null);

    // Profile Info Form
    const {
        data: profileData,
        setData: setProfileData,
        post: profilePost,
        processing: profileProcessing,
        errors: profileErrors,
    } = useForm({
        _method: 'PATCH', // We use POST + _method PATCH for file uploads in Laravel
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        nim: user.nim ?? '',
        nidn: user.nidn ?? '',
        avatar: null as File | string | null,
    });

    // Password Form
    const {
        data: passwordData,
        setData: setPasswordData,
        post: passwordPost,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: passwordReset,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profilePost(route('profile.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                // Clear the avatar file from state after successful upload to avoid re-sending it
                setProfileData('avatar', null);
            }
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordPost(route('profile.password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordReset(),
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout header={<h1 className="font-bold">Pengaturan Akun</h1>}>
            <Head title="Profil Saya - Repository KTI" />

            <div className="mx-auto max-w-4xl space-y-8">
                {/* ── Profile Section ───────────────────── */}
                <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="bg-gradient-to-r from-primary/10 via-background to-background pb-8">
                        <div className="flex flex-col items-center gap-6 sm:flex-row">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl sm:h-32 sm:w-32">
                                    <AvatarImage src={avatarPreview ?? ''} alt={user.name} />
                                    <AvatarFallback className="bg-primary/5 text-2xl font-bold text-primary">
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    type="button"
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 sm:h-10 sm:w-10"
                                >
                                    <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={avatarInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <div className="text-center sm:text-left">
                                <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                                <CardDescription className="mt-1 text-base">
                                    {user.department?.name ?? 'Mahasiswa'}
                                </CardDescription>
                                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                        ID: #{user.id}
                                    </span>
                                    {user.nim && (
                                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                                            NIM: {user.nim}
                                        </span>
                                    )}
                                    {user.nidn && (
                                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600">
                                            NIDN: {user.nidn}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData('name', e.target.value)}
                                            className={cn("pl-10", profileErrors.name && "border-destructive")}
                                        />
                                    </div>
                                    {profileErrors.name && <p className="text-xs text-destructive">{profileErrors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData('email', e.target.value)}
                                            className={cn("pl-10", profileErrors.email && "border-destructive")}
                                        />
                                    </div>
                                    {profileErrors.email && <p className="text-xs text-destructive">{profileErrors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">No. Telepon</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData('phone', e.target.value)}
                                            className={cn("pl-10", profileErrors.phone && "border-destructive")}
                                        />
                                    </div>
                                    {profileErrors.phone && <p className="text-xs text-destructive">{profileErrors.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dept">Departemen / Prodi</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="dept"
                                            value={user.department?.name ?? '-'}
                                            disabled
                                            className="pl-10 bg-muted/50"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Hubungi admin untuk mengubah data departemen.</p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={profileProcessing} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {profileProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* ── Password Section ───────────────────── */}
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound className="h-5 w-5 text-primary" />
                            Keamanan Akun
                        </CardTitle>
                        <CardDescription>
                            Perbarui password Anda secara berkala untuk menjaga keamanan akun.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="current_password">Password Saat Ini</Label>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                        className={cn(passwordErrors.current_password && "border-destructive")}
                                    />
                                    {passwordErrors.current_password && <p className="text-xs text-destructive">{passwordErrors.current_password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password Baru</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                        className={cn(passwordErrors.password && "border-destructive")}
                                    />
                                    {passwordErrors.password && <p className="text-xs text-destructive">{passwordErrors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                        className={cn(passwordErrors.password_confirmation && "border-destructive")}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={passwordProcessing} variant="secondary" className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {passwordProcessing ? 'Memperbarui...' : 'Update Password'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
