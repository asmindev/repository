import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
}

/**
 * Main application layout with sidebar and content area
 * Used for authenticated pages (student, lecturer, admin)
 */
export default function AppLayout({ children, title }: AppLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 overflow-auto">
                <div className="w-full">
                    <div className="flex h-14 w-full items-center border-b px-4">
                        <div className="pr-2">
                            <SidebarTrigger />
                        </div>
                        {title && (
                            <div className="w-full">
                                <h1 className="text-2xl font-bold">{title}</h1>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-6">{children}</div>
                </div>
            </main>
        </SidebarProvider>
    );
}
