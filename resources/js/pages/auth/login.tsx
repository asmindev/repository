import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { ChevronRight, Library, Lock, Mail } from 'lucide-react';

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
        <div className="relative flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-12 sm:px-6 lg:px-8">
            <Head title="Masuk Ke Akun Anda" />

            {/* Background pattern/gradient for a premium feel */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-50/50 blur-[120px]" />
                <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-blue-50/50 blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-[440px]">
                {/* Brand Branding */}

                <Card className="border-0 bg-transparent shadow-none">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20">
                                <Library className="h-7 w-7 text-white" />
                            </div>
                            <CardTitle className="mt-4 text-2xl font-bold tracking-tight text-gray-900">Repository KTI</CardTitle>
                            <CardDescription className="mt-1 text-sm font-medium text-gray-500">
                                Platform Manajemen Karya Tulis Ilmiah
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-10">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-4.5 w-4.5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama@institusi.ac.id"
                                        className="h-11 border-gray-200 pl-10 focus:border-blue-500 focus:ring-blue-500/20"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.email && <p className="text-xs font-medium text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Kata Sandi</Label>
                                    <a href="#" className="text-xs font-medium text-blue-600 underline-offset-4 hover:underline">
                                        Lupa password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-4.5 w-4.5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-11 border-gray-200 pl-10 focus:border-blue-500 focus:ring-blue-500/20"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.password && <p className="text-xs font-medium text-red-500">{errors.password}</p>}
                            </div>

                            <div className="flex items-center space-x-2 py-1">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm leading-none font-medium text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Ingat saya di perangkat ini
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="h-11 w-full bg-primary font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/80 active:scale-[0.98]"
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

                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-400">© 2026 Repository KTI • v1.0.0</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 flex justify-center space-x-6 text-xs font-medium text-gray-400">
                    <a href="#" className="transition-colors hover:text-blue-600">
                        Bantuan
                    </a>
                    <a href="#" className="transition-colors hover:text-blue-600">
                        Syarat & Ketentuan
                    </a>
                    <a href="#" className="transition-colors hover:text-blue-600">
                        Kebijakan Privasi
                    </a>
                </div>
            </div>
        </div>
    );
}
