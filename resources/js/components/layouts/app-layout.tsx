import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface AdminLayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
}

export default function AdminLayout({ children, header }: AdminLayoutProps) {
    const { props } = usePage<PageProps>();
    const { name } = usePage<any>().props;

    useEffect(() => {
        const flash = props?.flash || { type: 'message', content: '' };
        console.log(flash);

        if (flash.content) {
            toast[flash.type ?? 'message'](flash.content);
        }
    }, [props.flash]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="relative flex min-w-0 flex-col">
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md transition-all">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-foreground uppercase">
                            {name}
                        </span>
                    </div>
                    {header && <div className="ml-auto animate-in fade-in slide-in-from-right-4 duration-300">{header}</div>}
                </header>

                <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-auto p-6 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
