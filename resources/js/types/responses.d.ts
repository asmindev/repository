import type { ActivityLog } from './activity-log';
import type { Department, Faculty } from './department';
import type { PaginatedData } from './pagination';
import type { User } from './user';
import type { Work, WorkListItem } from './work';
import type { WorkCategory } from './work-category';

// ─── Dashboard Responses ───────────────────────────────

export interface StudentDashboardResponse {
    total_works: number;
    works_draft: number;
    works_submitted: number;
    works_approved: number;
    works_published: number;
    recent_works: WorkListItem[];
}

export interface LecturerDashboardResponse {
    total_reviews: number;
    reviews_pending: number;
    reviews_completed: number;
    assigned_works: PaginatedData<Work>;
}

export interface AdminDashboardResponse {
    total_users: number;
    total_works: number;
    total_works_published: number;
    works_pending_review: number;
    recent_activities: ActivityLog[];
}

// ─── Work Responses ────────────────────────────────────

export interface WorkDetailResponse {
    work: Work;
    can_edit: boolean;
    can_delete: boolean;
    can_submit: boolean;
    can_review: boolean;
}

export interface WorkIndexResponse {
    works: PaginatedData<WorkListItem>;
}

// ─── User Responses ───────────────────────────────────

export interface UserIndexResponse {
    users: PaginatedData<User>;
}

export interface UserDetailResponse {
    user: User;
}

// ─── Department Responses ──────────────────────────────

export interface DepartmentIndexResponse {
    departments: PaginatedData<Department>;
}

export interface FacultyListResponse {
    faculties: Faculty[];
}

// ─── WorkCategory Responses ────────────────────────────

export interface WorkCategoryIndexResponse {
    categories: PaginatedData<WorkCategory>;
}

// ─── Search Responses ──────────────────────────────────

export interface SearchResponse {
    works: PaginatedData<WorkListItem>;
    total: number;
}

// ─── Report Responses ──────────────────────────────────

export interface ReportData {
    title: string;
    data: Record<string, any>[];
    generated_at: string;
}
