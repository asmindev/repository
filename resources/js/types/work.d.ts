import type { Department } from './department';
import type { User } from './user';
import type { WorkCategory } from './work-category';

export type WorkStatus = 'draft' | 'pending_review' | 'in_review' | 'revision' | 'approved' | 'published' | 'rejected';

export type WorkVisibility = 'public' | 'restricted';

export type ReviewAction = 'assigned' | 'in_review' | 'approved' | 'rejected' | 'revision';

export interface WorkChapter {
    id: number;
    work_id: number;
    chapter_number: number;
    title: string;
    description: string | null;
    file_path: string;
    file_size: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface WorkReview {
    id: number;
    work_id: number;
    reviewer_id: number;
    action: ReviewAction;
    notes: string | null;
    changes: Record<string, any> | null; // JSON changes tracking
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    reviewer?: User;
}

export interface Work {
    id: number;
    category_id: number;
    department_id: number;
    author_id: number;
    supervisor_id: number | null;
    title: string;
    abstract: string;
    keywords: string[];
    year: number;
    language: 'id' | 'en';
    full_file_path: string | null;
    full_file_size: number | null;
    status: WorkStatus;
    visibility: WorkVisibility;
    view_count: number;
    download_count: number;
    published_at: string | null;
    submitted_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    // Relations
    author?: User;
    supervisor?: User | null;
    category?: WorkCategory;
    department?: Department;
    chapters?: WorkChapter[];
    reviews?: WorkReview[];
}

export interface WorkListItem {
    id: number;
    title: string;
    abstract: string;
    author: User;
    status: WorkStatus;
    visibility: WorkVisibility;
    view_count: number;
    download_count: number;
    published_at: string | null;
    created_at: string;
}
