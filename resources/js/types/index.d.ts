// ─── Type Imports ───────────────────────────────────────
export type { ActivityLog } from './activity-log';
export type { Department, Faculty } from './department';
export type {
    CreateDepartmentFormData,
    CreateFacultyFormData,
    CreateUserFormData,
    CreateWorkCategoryFormData,
    ReviewWorkFormData,
    StoreWorkFormData,
    SubmitWorkFormData,
    UpdateDepartmentFormData,
    UpdateFacultyFormData,
    UpdateUserFormData,
    UpdateWorkCategoryFormData,
    UpdateWorkFormData,
} from './forms';
export type { PaginatedData, PaginationLink } from './pagination';
export type {
    AdminDashboardResponse,
    DepartmentIndexResponse,
    FacultyListResponse,
    LecturerDashboardResponse,
    ReportData,
    SearchResponse,
    StudentDashboardResponse,
    UserDetailResponse,
    UserIndexResponse,
    WorkCategoryIndexResponse,
    WorkDetailResponse,
    WorkIndexResponse,
} from './responses';
export type { AuthUser, Permission, Role, User } from './user';
export type { ReviewAction, Work, WorkChapter, WorkListItem, WorkReview, WorkStatus, WorkVisibility } from './work';
export type { WorkCategory } from './work-category';

// ─── Inertia Shared Data Types ──────────────────────────

import type { AuthUser } from './user';

export interface Auth {
    user: AuthUser | null;
}

export interface SharedData {
    name: string;
    flash: Flash;
    auth: Auth;
    [key: string]: unknown;
}

export type Flash = {
    type: 'success' | 'error' | 'message' | null;
    content: string | null;
};

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: Auth;
    flash: Flash;
};
