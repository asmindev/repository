// File: resources/js/hooks/use-navigation.ts
// Hook untuk filter navigation berdasarkan user permissions

import { NAVIGATION_ITEMS, filterNavigation, type NavGroup } from '@/lib/navigation';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export function useNavigation(): NavGroup[] {
    const { auth } = usePage<PageProps>().props;

    const userPermissions = auth.user?.permissions ?? [];

    return useMemo(() => {
        return filterNavigation(NAVIGATION_ITEMS, userPermissions);
    }, [userPermissions]);
}

/**
 * Hook untuk cek apakah navigation kosong (user tidak punya akses apa pun)
 */
export function useHasNavigation(): boolean {
    const nav = useNavigation();
    return nav.length > 0 && nav.some((g) => g.items.length > 0);
}
