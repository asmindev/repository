import type { User } from './user';

export interface ActivityLog {
    id: number;
    user_id: number;
    subject_type: string; // Model class name (e.g., 'Work', 'User')
    subject_id: number; // Model instance ID
    action: string; // 'created', 'updated', 'deleted', etc.
    changes: Record<string, any> | null; // JSON old/new values
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user?: User;
}
