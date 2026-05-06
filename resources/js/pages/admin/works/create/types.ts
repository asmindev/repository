import type { Department } from '@/types/department';
import type { Work } from '@/types/work';
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
    work?: Work;
    categories: Pick<WorkCategory, 'id' | 'name' | 'has_supervisors'>[];
    departments: Pick<Department, 'id' | 'name'>[];
    authors: AuthorOption[];
    supervisors: SupervisorOption[];
}

export interface Chapter {
    id: string | number;
    title: string;
    chapter_number: string | number;
    description: string;
    file: File | null;
    file_url?: string;
    file_size?: number;
}

export interface WorksCreateForm {
    _method?: 'PUT';
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
    cover_image: File | null;
    chapters: Chapter[];
}
