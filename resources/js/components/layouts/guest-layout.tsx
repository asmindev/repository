import { ReactNode } from 'react';

interface GuestLayoutProps {
    children: ReactNode;
}

/**
 * Guest layout for login and auth pages
 * Simple, minimal layout without sidebar
 */
export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center space-x-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.75 10-10.747 0-6.002-4.5-10.747-10-10.747z"
                                />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-slate-900">KTI System</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Repository Karya Tulis Ilmiah</p>
                </div>

                {/* Content */}
                <div className="rounded-xl bg-white p-6 shadow-md">{children}</div>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-slate-600">© 2026 KTI System. All rights reserved.</p>
            </div>
        </div>
    );
}
