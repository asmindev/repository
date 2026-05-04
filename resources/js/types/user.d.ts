import type { Department } from './department';

export interface User {
    id: number;
    name: string;
    email: string;
    nim: string | null; // Nomor Induk Mahasiswa (students only)
    nidn: string | null; // Nomor Induk Dosen Nasional (lecturers only)
    avatar: string | null;
    department_id: number | null;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null; // Soft delete timestamp
    department?: Department;
    roles?: string[];
    permissions?: string[];
}

export interface AuthUser extends User {
    roles: string[];
    permissions: string[];
}

export type Role = 'admin' | 'dosen' | 'mahasiswa';

export type Permission =
    // User Management
    | 'user.view-any'
    | 'user.create'
    | 'user.update'
    | 'user.delete'
    // Work Management
    | 'work.view-any'
    | 'work.view-own'
    | 'work.create'
    | 'work.update-own'
    | 'work.delete-own'
    | 'work.submit'
    | 'work.review'
    | 'work.approve'
    | 'work.reject'
    | 'work.publish'
    | 'work.assign-reviewer'
    // Reports & Settings
    | 'report.export'
    | 'setting.manage';
