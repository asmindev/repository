import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { GalleryVerticalEnd, Menu } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
}

/**
 * Public layout for home, search, and work detail pages
 * Includes navigation header and optional sidebar
 */
export default function PublicLayout({ children, title }: PublicLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* ─── Header ─────────────────────────────────── */}
            <header className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 font-bold">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <GalleryVerticalEnd className="h-5 w-5" />
                            </div>
                            <span className="hidden sm:inline">KTI System</span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden space-x-6 md:flex">
                            <Link href="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                                Beranda
                            </Link>
                            <Link href={route('search')} className="text-sm font-medium text-slate-700 hover:text-slate-900">
                                Cari Karya
                            </Link>
                            <a href="#" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                                Tentang
                            </a>
                        </nav>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            <Link href={route('login')}>
                                <Button variant="outline" size="sm">
                                    Masuk
                                </Button>
                            </Link>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                                <Menu className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <nav className="mt-4 space-y-2 md:hidden">
                            <Link href="/" className="block py-2 text-sm font-medium text-slate-700">
                                Beranda
                            </Link>
                            <Link href={route('search')} className="block py-2 text-sm font-medium text-slate-700">
                                Cari Karya
                            </Link>
                            <a href="#" className="block py-2 text-sm font-medium text-slate-700">
                                Tentang
                            </a>
                        </nav>
                    )}
                </div>
            </header>

            {/* ─── Page Title ─────────────────────────────── */}
            {title && (
                <div className="border-b bg-slate-50">
                    <div className="mx-auto max-w-7xl px-6 py-6">
                        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                    </div>
                </div>
            )}

            {/* ─── Main Content ──────────────────────────── */}
            <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>

            {/* ─── Footer ─────────────────────────────────── */}
            <footer className="border-t bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="grid gap-8 md:grid-cols-4">
                        {/* About */}
                        <div>
                            <h3 className="font-semibold text-slate-900">KTI System</h3>
                            <p className="mt-2 text-sm text-slate-600">Platform digital untuk mengelola karya tulis ilmiah dan akademik.</p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="font-semibold text-slate-900">Platform</h4>
                            <ul className="mt-2 space-y-1">
                                <li>
                                    <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
                                        Beranda
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('search')} className="text-sm text-slate-600 hover:text-slate-900">
                                        Cari Karya
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-semibold text-slate-900">Dukungan</h4>
                            <ul className="mt-2 space-y-1">
                                <li>
                                    <a href="mailto:support@kti.local" className="text-sm text-slate-600 hover:text-slate-900">
                                        Hubungi Kami
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-semibold text-slate-900">Legal</h4>
                            <ul className="mt-2 space-y-1">
                                <li>
                                    <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                                        Kebijakan Privasi
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                                        Syarat & Ketentuan
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-8 text-center text-sm text-slate-600">© 2026 KTI System. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
}
