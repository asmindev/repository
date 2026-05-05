import type { Department } from '@/types/department';
import type { WorkCategory } from '@/types/work-category';

export interface AuthorOption {
    id: number;
    name: string;
    nim: string | null;
}

export interface SupervisorOption {
    id: number;
    name: string;
    nidn: string | null;
}

export interface WorksCreateProps {
    categories: Pick<WorkCategory, 'id' | 'name'>[];
    departments: Pick<Department, 'id' | 'name'>[];
    authors: AuthorOption[];
    supervisors: SupervisorOption[];
}

export interface Chapter {
    id: string;
    title: string;
    chapter_number: string;
    description: string;
    file: File | null;
}

export interface WorksCreateForm {
    category_id: string;
    department_id: string;
    author_id: string;
    author_nim: string;
    supervisor_ids: string[];
    title: string;
    abstract: string;
    keywords: string;
    year: string;
    language: string;
    visibility: string;
    full_file: File | null;
    chapters: Chapter[];
}
