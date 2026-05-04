// File: resources/js/components/app-sidebar.tsx
// Component name: PascalCase ✅

import { Link, usePage } from '@inertiajs/react';
import { GalleryVerticalEnd, LogOut } from 'lucide-react';
import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { useNavigation } from '@/hooks/use-navigation';
import type { NavItem } from '@/lib/navigation';
import type { PageProps } from '@/types';

// ─── Badge Component ────────────────────────────────────

function NavBadge({ value, color = 'red' }: { value: string | number; color?: 'red' | 'blue' | 'green' | 'yellow' }) {
    const colorClasses = {
        red: 'bg-red-500 text-white',
        blue: 'bg-blue-500 text-white',
        green: 'bg-emerald-500 text-white',
        yellow: 'bg-amber-500 text-white',
    };

    return (
        <span className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${colorClasses[color]}`}>
            {value}
        </span>
    );
}

// ─── Recursive Menu Renderer ────────────────────────────

function NavItems({ items }: { items: NavItem[] }) {
    const { url: currentUrl } = usePage<PageProps>();

    const isActive = (item: NavItem): boolean => {
        if (item.exact) {
            return currentUrl === item.url;
        }
        return currentUrl.startsWith(item.url) && item.url !== '#';
    };

    return (
        <>
            {items.map((item) => {
                const active = isActive(item);
                const hasSubItems = item.items && item.items.length > 0;

                return (
                    <React.Fragment key={item.title}>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={item.title} isActive={active} className="relative">
                                <Link href={item.url} className={`font-medium ${active ? 'text-sidebar-primary-foreground' : ''}`}>
                                    <item.icon className="size-4 shrink-0" />
                                    <span className="truncate">{item.title}</span>
                                    {item.badge && <NavBadge value={item.badge} color={item.badgeColor} />}
                                </Link>
                            </SidebarMenuButton>

                            {/* Sub-menu */}
                            {hasSubItems && (
                                <SidebarMenuSub>
                                    {item.items!.map((subItem) => {
                                        const subActive = isActive(subItem);

                                        return (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild isActive={subActive}>
                                                    <Link href={subItem.url} className={`text-xs ${subActive ? 'font-medium' : ''}`}>
                                                        {subItem.icon && <subItem.icon className="size-3 shrink-0" />}
                                                        <span className="truncate">{subItem.title}</span>
                                                        {subItem.badge && <NavBadge value={subItem.badge} color={subItem.badgeColor} />}
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        );
                                    })}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    </React.Fragment>
                );
            })}
        </>
    );
}

// ─── Main Sidebar Component ─────────────────────────────

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<PageProps>().props;
    const navMenu = useNavigation();

    // Role badge text & color
    const roleConfig = {
        admin: { text: 'Admin', color: 'bg-purple-500' },
        dosen: { text: 'Dosen', color: 'bg-blue-500' },
        mahasiswa: { text: 'Mahasiswa', color: 'bg-emerald-500' },
    };

    const userRole = auth.user?.roles?.[0] as keyof typeof roleConfig;
    const roleBadge = userRole ? roleConfig[userRole] : null;

    return (
        <Sidebar {...props} collapsible="icon">
            {/* ═══ Header ═════════════════════════════════ */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" className="font-semibold">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 overflow-hidden leading-none">
                                    <span className="truncate font-bold">KTI System</span>
                                    <span className="truncate text-xs text-sidebar-foreground/70">Repository Akademik</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator />

            {/* ═══ Content ════════════════════════════════ */}
            <SidebarContent className="gap-0">
                {navMenu.map((group, index) => (
                    <React.Fragment key={group.label}>
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-sidebar-foreground/50 uppercase">
                                {group.label}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <NavItems items={group.items} />
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                        {index < navMenu.length - 1 && <SidebarSeparator className="my-2" />}
                    </React.Fragment>
                ))}
            </SidebarContent>

            <SidebarSeparator />

            {/* ═══ Footer ═════════════════════════════════ */}
            <SidebarFooter>
                {/* User Info Card */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg" className="h-auto py-3">
                            <Link href={route('profile.edit')} className="gap-3">
                                {/* Avatar placeholder */}
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
                                    {auth.user?.name?.charAt(0).toUpperCase() ?? 'U'}
                                </div>

                                <div className="flex flex-col gap-0.5 overflow-hidden">
                                    <span className="truncate text-sm font-medium">{auth.user?.name ?? 'User'}</span>
                                    <span className="truncate text-xs text-sidebar-foreground/60">{auth.user?.email ?? ''}</span>
                                </div>

                                {/* Role Badge */}
                                {roleBadge && (
                                    <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${roleBadge.color}`}>
                                        {roleBadge.text}
                                    </span>
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Logout */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="sm" tooltip="Keluar" className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
                            <Link href={route('logout')} method="post" as="button" className="text-xs">
                                <LogOut className="size-4" />
                                <span>Keluar</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            {/* ═══ Rail ═══════════════════════════════════ */}
            <SidebarRail />
        </Sidebar>
    );
}
