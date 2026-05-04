export interface Faculty {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    departments?: Department[];
}

export interface Department {
    id: number;
    faculty_id: number;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    faculty?: Faculty;
}
