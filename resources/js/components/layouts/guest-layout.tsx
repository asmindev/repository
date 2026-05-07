import { usePage } from '@inertiajs/react';
import { GalleryVerticalEnd } from 'lucide-react';
import { ReactNode } from 'react';

interface GuestLayoutProps {
    children: ReactNode;
}

/**
 * Guest layout for login and auth pages
 * Simple, minimal layout without sidebar
 */
export default function GuestLayout({ children }: GuestLayoutProps) {
    const { name } = usePage<any>().props;

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/20 font-sans antialiased">
            <div className="w-full max-w-md px-6">
                {/* Logo */}
                <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="inline-flex items-center justify-center space-x-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background p-1 shadow-lg shadow-foreground/5 ring-1 ring-border">
                            <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-foreground uppercase">
                            {name}
                        </span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-muted-foreground/80">
                        Repositori Digital Karya Tulis Ilmiah
                    </p>
                </div>

                {/* Content */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-xl shadow-foreground/5 animate-in zoom-in-95 duration-500">
                    {children}
                </div>

                {/* Footer */}
                <div className="mt-10 text-center animate-in fade-in duration-700">
                    <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
                        © 2026 {name}. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
