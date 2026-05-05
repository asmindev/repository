// File: resources/js/components/app-sidebar.tsx
// Component name: PascalCase ✅

import { Link, usePage } from '@inertiajs/react';
import { GalleryVerticalEnd } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/sidebar';
import { useNavigation } from '@/hooks/use-navigation';
import type { NavItem } from '@/lib/navigation';
import type { PageProps } from '@/types';
import { NavUser } from './nav-user';

// ─── Badge Helper ───────────────────────────────────────

function NavBadge({ value, color = 'red' }: { value: string | number; color?: 'red' | 'blue' | 'green' | 'yellow' }) {
    const variants: Record<string, any> = {
        red: 'destructive',
        blue: 'default',
        green: 'secondary', // We can customize secondary or use custom classes
        yellow: 'outline',
    };

    // For green and yellow, if Shadcn doesn't have them by default, we use custom classes on top of Badge
    const customClasses = {
        red: '',
        blue: 'bg-primary text-primary-foreground',
        green: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
        yellow: 'bg-amber-500/15 text-amber-600 border-amber-500/20',
    };

    return (
        <Badge 
            variant={variants[color] || 'default'} 
            className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold border-0 ${customClasses[color as keyof typeof customClasses]}`}
        >
            {value}
        </Badge>
    );
}

// ─── Nav Item (Collapsible if has children) ──────────────

function NavItemRow({ item, currentUrl }: { item: NavItem; currentUrl: string }) {
    const isActive = (i: NavItem): boolean => {
        if (i.exact) return currentUrl === i.url;
        return currentUrl.startsWith(i.url) && i.url !== '#';
    };

    const active = isActive(item);
    const hasSubItems = Boolean(item.items && item.items.length > 0);

    if (!hasSubItems) {
        // ── Leaf item: simple link ──────────────────────
        return (
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
                    <Link href={item.url}>
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                        {item.badge && <NavBadge value={item.badge} color={item.badgeColor} />}
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    // ── Parent item with static sub-menu ───────────
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild={item.url !== '#'} tooltip={item.title} isActive={active} className="font-semibold text-sidebar-foreground/70">
                {item.url !== '#' ? (
                    <Link href={item.url}>
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                        {item.badge && <NavBadge value={item.badge} color={item.badgeColor} />}
                    </Link>
                ) : (
                    <>
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                        {item.badge && <NavBadge value={item.badge} color={item.badgeColor} />}
                    </>
                )}
            </SidebarMenuButton>

            <SidebarMenuSub className="mt-1 ml-4.5 border-l-1 border-sidebar-border/50">
                {item.items!.map((subItem) => {
                    const subActive = isActive(subItem);
                    return (
                        <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={subActive}>
                                <Link href={subItem.url}>
                                    {subItem.icon && <subItem.icon className="size-3 shrink-0" />}
                                    <span className="truncate">{subItem.title}</span>
                                    {subItem.badge && <NavBadge value={subItem.badge} color={subItem.badgeColor} />}
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    );
                })}
            </SidebarMenuSub>
        </SidebarMenuItem>
    );
}

// ─── Nav Items List ──────────────────────────────────────

function NavItems({ items }: { items: NavItem[] }) {
    const { url: currentUrl } = usePage<PageProps>();

    return (
        <>
            {items.map((item) => (
                <NavItemRow key={item.title} item={item} currentUrl={currentUrl} />
            ))}
        </>
    );
}

// ─── Main Sidebar Component ─────────────────────────────

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth, name } = usePage<any>().props;
    const navMenu = useNavigation();

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
                                    <span className="truncate font-bold uppercase">{name}</span>
                                    <span className="truncate text-xs text-sidebar-foreground/70">Repository Akademik</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* ═══ Content ════════════════════════════════ */}
            <SidebarContent className="gap-0">
                {navMenu.map((group, _) => (
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
                    </React.Fragment>
                ))}
            </SidebarContent>

            {/* ═══ Footer ═════════════════════════════════ */}
            <SidebarFooter>
                <NavUser
                    user={{
                        name: auth.user?.name ?? 'User',
                        email: auth.user?.email ?? '',
                        avatar: auth.user?.avatar ?? '',
                    }}
                />
            </SidebarFooter>

            {/* ═══ Rail ═══════════════════════════════════ */}
            <SidebarRail />
        </Sidebar>
    );
}
