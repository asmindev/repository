// File: resources/js/lib/permissions.ts
// Folder & file: kebab-case ✅
// Types: PascalCase ✅

// ============================================
// PERMISSION TYPES - Sesuai Dokumen Bagian 5
// ============================================

export type Permission =
    // User Management (Admin only)
    | 'user.view-any'
    | 'user.create'
    | 'user.update'
    | 'user.delete'

    // Work/Karya Management
    | 'work.view-any' // Admin & Dosen: lihat semua karya
    | 'work.view-own' // Mahasiswa: lihat karya sendiri
    | 'work.create' // Mahasiswa & Admin
    | 'work.update-own' // Mahasiswa: edit karya sendiri (draft)
    | 'work.delete-own' // Mahasiswa & Admin: hapus draft
    | 'work.submit' // Mahasiswa: submit ke review
    | 'work.review' // Dosen & Admin: review karya
    | 'work.approve' // Dosen & Admin: approve karya
    | 'work.reject' // Dosen & Admin: reject karya
    | 'work.publish' // Admin: publish karya
    | 'work.assign-reviewer' // Admin: assign dosen reviewer

    // Reports & Settings (Admin only)
    | 'report.export'
    | 'setting.manage';

export type Role = 'admin' | 'dosen' | 'mahasiswa';

// ============================================
// AUTH USER TYPE
// ============================================

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    nim: string | null; // Untuk mahasiswa
    nidn: string | null; // Untuk dosen
    avatar: string | null;
    department_id: number | null;
    is_active: boolean;
    roles: Role[];
    permissions: Permission[];
};

export type AuthData = {
    user: AuthUser | null;
};

// ============================================
// HELPER FUNCTIONS (Standalone - tanpa hook)
// ============================================

/**
 * Check if user has specific permission
 *
 * @example
 * can('work.create', userPermissions) → boolean
 * can(['work.create', 'work.update-own'], userPermissions) → boolean (OR logic)
 */
export function can(permissions: Permission | Permission[], userPermissions?: Permission[]): boolean {
    if (!userPermissions || userPermissions.length === 0) return false;

    const perms = Array.isArray(permissions) ? permissions : [permissions];

    return perms.some((permission) => userPermissions.includes(permission));
}

/**
 * Check if user has ALL specified permissions
 *
 * @example
 * canAll(['work.review', 'work.approve'], userPermissions) → boolean
 */
export function canAll(permissions: Permission[], userPermissions?: Permission[]): boolean {
    if (!userPermissions || userPermissions.length === 0) return false;

    return permissions.every((permission) => userPermissions.includes(permission));
}

/**
 * Check if user has specific role
 *
 * @example
 * hasRole('admin', userRoles) → boolean
 * hasRole(['admin', 'dosen'], userRoles) → boolean (OR logic)
 */
export function hasRole(roles: Role | Role[], userRoles?: Role[]): boolean {
    if (!userRoles || userRoles.length === 0) return false;

    const roleList = Array.isArray(roles) ? roles : [roles];

    return roleList.some((role) => userRoles.includes(role));
}

/**
 * Check if user has ALL specified roles
 *
 * @example
 * hasAllRoles(['admin', 'dosen'], userRoles) → boolean
 */
export function hasAllRoles(roles: Role[], userRoles?: Role[]): boolean {
    if (!userRoles || userRoles.length === 0) return false;

    return roles.every((role) => userRoles.includes(role));
}

// ============================================
// ROLE-SPECIFIC HELPERS
// ============================================

/**
 * Check if user is admin
 */
export function isAdmin(userRoles?: Role[]): boolean {
    return hasRole('admin', userRoles);
}

/**
 * Check if user is dosen
 */
export function isDosen(userRoles?: Role[]): boolean {
    return hasRole('dosen', userRoles);
}

/**
 * Check if user is mahasiswa
 */
export function isMahasiswa(userRoles?: Role[]): boolean {
    return hasRole('mahasiswa', userRoles);
}

/**
 * Check if user is admin OR dosen
 */
export function isAdminOrDosen(userRoles?: Role[]): boolean {
    return hasRole(['admin', 'dosen'], userRoles);
}

/**
 * Check if user is admin OR mahasiswa
 */
export function isAdminOrMahasiswa(userRoles?: Role[]): boolean {
    return hasRole(['admin', 'mahasiswa'], userRoles);
}
