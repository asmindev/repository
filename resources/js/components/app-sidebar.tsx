// File: resources/js/components/app-sidebar.tsx
// Component name: PascalCase ✅

import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, GalleryVerticalEnd } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as React from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
import { NavUser } from './nav-user';

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

// ─── Nav Item (Collapsible if has children) ──────────────

function NavItemRow({ item, currentUrl }: { item: NavItem; currentUrl: string }) {
    const isActive = (i: NavItem): boolean => {
        if (i.exact) return currentUrl === i.url;
        return currentUrl.startsWith(i.url) && i.url !== '#';
    };

    const active = isActive(item);
    const hasSubItems = Boolean(item.items && item.items.length > 0);

    // Controlled state: auto-open when any sub-item matches current URL
    const hasActiveSub = hasSubItems && item.items!.some((sub) => isActive(sub));
    const [open, setOpen] = useState(hasActiveSub);

    // Re-evaluate on navigation (currentUrl changes via Inertia)
    useEffect(() => {
        if (hasSubItems && item.items!.some((sub) => isActive(sub))) {
            setOpen(true);
        }
    }, [currentUrl]);

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

    // ── Parent item with collapsible sub-menu ───────────
    return (
        <Collapsible asChild open={open} onOpenChange={setOpen} className="group/collapsible">
            <SidebarMenuItem>
                {/* Trigger button (not a link) */}
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={active}>
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                        {item.badge && <NavBadge value={item.badge} color={item.badgeColor} />}
                        {/* Chevron rotates when open */}
                        <ChevronRight className="ml-auto size-3.5 shrink-0 text-sidebar-foreground/50 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* Collapsible sub-menu */}
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items!.map((subItem) => {
                            const subActive = isActive(subItem);
                            return (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild isActive={subActive}>
                                        <Link href={subItem.url}>
                                            {subItem.icon && <subItem.icon className="size-3 shrink-0" />}
                                            <span className="truncate">{subItem.title}</span>
                                            {subItem.badge && (
                                                <NavBadge value={subItem.badge} color={subItem.badgeColor} />
                                            )}
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            );
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
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
    const { auth } = usePage<PageProps>().props;
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
                                    <span className="truncate font-bold">KTI System</span>
                                    <span className="truncate text-xs text-sidebar-foreground/70">Repository Akademik</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

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

            {/* ═══ Footer ═════════════════════════════════ */}
            <SidebarFooter>
                <SidebarSeparator />
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
