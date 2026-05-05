import GuestLayout from '@/components/layouts/guest-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { ChevronRight, Lock, Mail } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk Ke Akun" />

            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Selamat Datang Kembali
                    </h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                        Silakan masuk ke akun Anda untuk melanjutkan
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Alamat Email
                        </Label>
                        <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60 group-focus-within:text-primary transition-colors">
                                <Mail className="h-4.5 w-4.5" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@institusi.ac.id"
                                className="h-11 border-border pl-10 transition-all focus:ring-primary/20"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        {errors.email && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Kata Sandi
                            </Label>
                            <a href="#" className="text-xs font-medium text-primary underline-offset-4 hover:underline">
                                Lupa sandi?
                            </a>
                        </div>
                        <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60 group-focus-within:text-primary transition-colors">
                                <Lock className="h-4.5 w-4.5" />
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-11 border-border pl-10 transition-all focus:ring-primary/20"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                        </div>
                        {errors.password && <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center space-x-2 py-1">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked as boolean)}
                        />
                        <Label
                            htmlFor="remember"
                            className="text-sm font-medium text-muted-foreground/80 cursor-pointer select-none"
                        >
                            Ingat saya di perangkat ini
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="h-11 w-full bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
                        disabled={processing}
                    >
                        {processing ? (
                            'Memproses...'
                        ) : (
                            <>
                                Masuk Ke Akun
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="pt-4 text-center">
                    <p className="text-xs text-muted-foreground">
                        Belum punya akun? Hubungi Admin Departemen
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
