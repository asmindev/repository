// File: resources/js/components/permissions.tsx
// Folder & file: kebab-case ✅
// Component names: PascalCase ✅

import type { Permission, Role } from '@/lib/permissions';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

// ============================================
// CAN COMPONENT - Permission-based rendering
// ============================================

type CanProps = {
    permission: Permission | Permission[];
    /** Render when user doesn't have permission */
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

/**
 * Component to conditionally render based on permissions
 *
 * @example
 * <Can permission="work.create">
 *   <Button>Upload Karya</Button>
 * </Can>
 *
 * @example
 * <Can permission={['work.approve', 'work.reject']} fallback={<p>Tidak ada akses</p>}>
 *   <ReviewActions />
 * </Can>
 *
 * @example
 * <Can permission="work.publish">
 *   <Button variant="success">Publish</Button>
 * </Can>
 */
export function Can({ permission, fallback = null, children }: CanProps) {
    const { auth } = usePage<PageProps>().props;

    if (!auth.user) return <>{fallback}</>;

    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = permissions.some((perm) => auth.user!.permissions.includes(perm as string));

    return hasPermission ? <>{children}</> : <>{fallback}</>;
}

// ============================================
// CAN-ALL COMPONENT - All permissions required
// ============================================

type CanAllProps = {
    permissions: Permission[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

/**
 * Component to render only if user has ALL specified permissions
 *
 * @example
 * <CanAll permissions={['work.review', 'work.approve']}>
 *   <AdvancedReviewPanel />
 * </CanAll>
 */
export function CanAll({ permissions, fallback = null, children }: CanAllProps) {
    const { auth } = usePage<PageProps>().props;

    if (!auth.user) return <>{fallback}</>;

    const hasAllPermissions = permissions.every((perm) => auth.user!.permissions.includes(perm as string));

    return hasAllPermissions ? <>{children}</> : <>{fallback}</>;
}

// ============================================
// HAS-ROLE COMPONENT - Role-based rendering
// ============================================

type HasRoleProps = {
    role: Role | Role[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

/**
 * Component to conditionally render based on roles
 *
 * @example
 * <HasRole role="admin">
 *   <AdminDashboard />
 * </HasRole>
 *
 * @example
 * <HasRole role={['admin', 'dosen']}>
 *   <ReviewPanel />
 * </HasRole>
 */
export function HasRole({ role, fallback = null, children }: HasRoleProps) {
    const { auth } = usePage<PageProps>().props;

    if (!auth.user) return <>{fallback}</>;

    const roles = Array.isArray(role) ? role : [role];
    const hasRole = roles.some((r) => auth.user!.roles.includes(r));

    return hasRole ? <>{children}</> : <>{fallback}</>;
}

// ============================================
// HAS-ALL-ROLES COMPONENT
// ============================================

type HasAllRolesProps = {
    roles: Role[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

/**
 * Component to render only if user has ALL specified roles
 * (Jarang dipakai, tapi tersedia jika perlu)
 */
export function HasAllRoles({ roles, fallback = null, children }: HasAllRolesProps) {
    const { auth } = usePage<PageProps>().props;

    if (!auth.user) return <>{fallback}</>;

    const hasAll = roles.every((r) => auth.user!.roles.includes(r));

    return hasAll ? <>{children}</> : <>{fallback}</>;
}

// ============================================
// AUTHENTICATED COMPONENT - Login check only
// ============================================

type AuthenticatedProps = {
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

/**
 * Render children only if user is logged in
 *
 * @example
 * <Authenticated fallback={<LoginPrompt />}>
 *   <UserProfile />
 * </Authenticated>
 */
export function Authenticated({ fallback = null, children }: AuthenticatedProps) {
    const { auth } = usePage<PageProps>().props;

    return auth.user ? <>{children}</> : <>{fallback}</>;
}

// ============================================
// GUEST COMPONENT - Opposite of Authenticated
// ============================================

type GuestProps = {
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

/**
 * Render children only if user is NOT logged in
 *
 * @example
 * <Guest fallback={<UserMenu />}>
 *   <LoginButton />
 * </Guest>
 */
export function Guest({ fallback = null, children }: GuestProps) {
    const { auth } = usePage<PageProps>().props;

    return !auth.user ? <>{children}</> : <>{fallback}</>;
}
