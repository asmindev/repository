// File: resources/js/hooks/use-permission.ts
// Folder & file: kebab-case ✅
// Function name: camelCase ✅

import type { Permission, Role } from '@/lib/permissions';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

/**
 * Hook to check permissions & roles in React components
 *
 * @example
 * const { can, hasRole, user, isAdmin, isDosen, isMahasiswa } = usePermission();
 *
 * if (can('work.create')) {
 *   // Show upload button
 * }
 *
 * if (hasRole('dosen')) {
 *   // Show reviewer panel
 * }
 *
 * if (isAdmin()) {
 *   // Show admin dashboard link
 * }
 */
export function usePermission() {
    const { auth } = usePage<PageProps>().props;

    // ─── Permission Checks ─────────────────────────────

    const can = (permission: Permission | Permission[]): boolean => {
        if (!auth.user) return false;
        const permissions = Array.isArray(permission) ? permission : [permission];
        return permissions.some((perm) => auth.user!.permissions.includes(perm));
    };

    const canAll = (permissions: Permission[]): boolean => {
        if (!auth.user) return false;
        return permissions.every((perm) => auth.user!.permissions.includes(perm));
    };

    const cannot = (permission: Permission | Permission[]): boolean => {
        return !can(permission);
    };

    // ─── Role Checks ───────────────────────────────────

    const hasRole = (role: Role | Role[]): boolean => {
        if (!auth.user) return false;
        const roles = Array.isArray(role) ? role : [role];
        return roles.some((r) => auth.user!.roles.includes(r));
    };

    const hasAllRoles = (roles: Role[]): boolean => {
        if (!auth.user) return false;
        return roles.every((r) => auth.user!.roles.includes(r));
    };

    // ─── Convenience Helpers ───────────────────────────

    const isAdmin = (): boolean => hasRole('admin');
    const isDosen = (): boolean => hasRole('dosen');
    const isMahasiswa = (): boolean => hasRole('mahasiswa');
    const isAdminOrDosen = (): boolean => hasRole(['admin', 'dosen']);
    const isAdminOrMahasiswa = (): boolean => hasRole(['admin', 'mahasiswa']);

    // ─── Work Status Helpers (Business Logic) ──────────

    /**
     * Check if user can edit a work based on status
     * Mahasiswa hanya bisa edit karya sendiri yang statusnya draft
     */
    const canEditWork = (workStatus: string, isOwner: boolean): boolean => {
        if (isAdmin()) return true;
        if (isMahasiswa() && isOwner && workStatus === 'draft') return true;
        return false;
    };

    /**
     * Check if user can delete a work
     */
    const canDeleteWork = (workStatus: string, isOwner: boolean): boolean => {
        if (isAdmin()) return true;
        if (isMahasiswa() && isOwner && workStatus === 'draft') return true;
        return false;
    };

    /**
     * Check if user can review a work
     */
    const canReviewWork = (workStatus: string): boolean => {
        if (!isAdminOrDosen()) return false;
        return ['pending_review', 'in_review'].includes(workStatus);
    };

    /**
     * Check if user can publish a work
     */
    const canPublishWork = (workStatus: string): boolean => {
        return isAdmin() && workStatus === 'approved';
    };

    // ─── Return ────────────────────────────────────────

    return {
        // Permission
        can,
        canAll,
        cannot,

        // Role
        hasRole,
        hasAllRoles,

        // Convenience
        isAdmin,
        isDosen,
        isMahasiswa,
        isAdminOrDosen,
        isAdminOrMahasiswa,

        // Business Logic
        canEditWork,
        canDeleteWork,
        canReviewWork,
        canPublishWork,

        // Raw data
        user: auth.user || null,
        permissions: (auth.user?.permissions as Permission[]) || [],
        roles: (auth.user?.roles as Role[]) || [],
        isAuthenticated: !!auth.user,
    };
}
