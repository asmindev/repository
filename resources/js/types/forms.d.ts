// ─── Work Form Requests ────────────────────────────────

export interface StoreWorkFormData {
    category_id: number;
    title: string;
    abstract: string;
    keywords: string[];
    year: number;
    language: 'id' | 'en';
    full_file?: File; // Optional for draft
}

export interface UpdateWorkFormData {
    title: string;
    abstract: string;
    keywords: string[];
    year: number;
    language: 'id' | 'en';
    full_file?: File;
}

export interface SubmitWorkFormData {
    // No additional data needed, just submit action
}

// ─── Review Form Requests ──────────────────────────────

export interface ReviewWorkFormData {
    action: 'approved' | 'rejected' | 'revision';
    notes?: string;
}

// ─── User Form Requests ────────────────────────────────

export interface CreateUserFormData {
    name: string;
    email: string;
    nim?: string; // For students
    nidn?: string; // For lecturers
    department_id: number;
    roles: string[];
    password?: string; // Admin sets initial password
}

export interface UpdateUserFormData {
    name: string;
    email: string;
    nim?: string;
    nidn?: string;
    department_id: number;
    roles: string[];
    is_active: boolean;
}

// ─── Department Form Requests ──────────────────────────

export interface CreateDepartmentFormData {
    faculty_id: number;
    name: string;
    description?: string;
}

export interface UpdateDepartmentFormData {
    faculty_id: number;
    name: string;
    description?: string;
}

// ─── Faculty Form Requests ────────────────────────────

export interface CreateFacultyFormData {
    name: string;
    description?: string;
}

export interface UpdateFacultyFormData {
    name: string;
    description?: string;
}

// ─── Work Category Form Requests ───────────────────────

export interface CreateWorkCategoryFormData {
    name: string;
    description?: string;
}

export interface UpdateWorkCategoryFormData {
    name: string;
    description?: string;
}
