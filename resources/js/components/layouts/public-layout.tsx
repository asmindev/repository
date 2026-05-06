import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link, usePage } from '@inertiajs/react';
import { GalleryVerticalEnd, Menu, Search } from 'lucide-react';
import { ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function PublicLayout({ children, title }: PublicLayoutProps) {
    const { name } = usePage<any>().props;

    const navLinks = [
        { href: '/', label: 'Beranda' },
        { href: route('search'), label: 'Cari' },
        { href: route('works.submit.create'), label: 'Upload' },
        { href: '#', label: 'Tentang' },
    ];

    return (
        <div className="min-h-screen bg-muted/20 font-sans antialiased">
            {/* ─── Header ─────────────────────────────────── */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="group flex items-center space-x-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                                <GalleryVerticalEnd className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground uppercase">{name}</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center space-x-8 md:flex">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                            <Link href={route('login')}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hidden font-semibold text-muted-foreground hover:text-primary sm:inline-flex"
                                >
                                    Masuk
                                </Button>
                            </Link>
                            <Link href={route('search')}>
                                <Button
                                    size="sm"
                                    className="rounded-lg bg-primary px-5 font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Cari
                                </Button>
                            </Link>

                            {/* Mobile Navigation Trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary md:hidden">
                                        <Menu className="h-6 w-6" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] p-0">
                                    <SheetHeader className="border-b p-6 text-left">
                                        <Link href="/" className="flex items-center space-x-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                                <GalleryVerticalEnd className="h-4 w-4" />
                                            </div>
                                            <SheetTitle className="text-lg font-bold tracking-tight uppercase">{name}</SheetTitle>
                                        </Link>
                                    </SheetHeader>
                                    <nav className="flex flex-col gap-2 p-6">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.label}
                                                href={link.href}
                                                className="rounded-md p-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-primary"
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                        <Separator className="my-2" />
                                        <Link
                                            href={route('login')}
                                            className="rounded-md p-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-primary"
                                        >
                                            Masuk
                                        </Link>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            {/* ─── Page Title (Optional) ─────────────────────────── */}
            {title && (
                <div className="border-b bg-background py-10">
                    <div className="mx-auto max-w-7xl px-6">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                    </div>
                </div>
            )}

            {/* ─── Main Content ──────────────────────────── */}
            <main className="min-h-screen">{children}</main>

            {/* ─── Footer ─────────────────────────────────── */}
            <footer className="mt-auto border-t border-border bg-background py-12">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-12 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <GalleryVerticalEnd className="h-5 w-5" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-foreground uppercase">{name}</span>
                            </Link>
                            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                                Repositori digital terpadu untuk publikasi civitas akademika. Akses pengetahuan kapan saja, di mana saja.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold tracking-wider text-foreground uppercase">Platform</h4>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                        Beranda
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('search')} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                        Publikasi
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold tracking-wider text-foreground uppercase">Bantuan</h4>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                        Panduan
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                        Kebijakan
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                                        Kontak
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <Separator className="my-8 opacity-50" />

                    <div className="text-center">
                        <p className="text-xs text-muted-foreground/60">© 2026 {name}. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
