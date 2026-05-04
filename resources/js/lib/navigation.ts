// File: resources/js/lib/navigation.ts
// Folder & file: kebab-case ✅

import {
    BarChart3,
    BookOpen,
    BookText,
    Building2,
    FileCheck2,
    FileClock,
    FileSearch,
    FolderOpen,
    Gauge,
    Inbox,
    Layers,
    ListTodo,
    Upload,
    UserCog,
    Users,
} from 'lucide-react';
import type React from 'react';

// ─── Types ──────────────────────────────────────────────

export interface NavItem {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: 'red' | 'blue' | 'green' | 'yellow';
    items?: NavItem[];
    permission?: string | string[];
    exact?: boolean; // true = exact match for active state
}

export interface NavGroup {
    label: string;
    items: NavItem[];
    permission?: string | string[]; // permission untuk semua item di group
}

// ─── Helper: Permission check (standalone) ─────────────

function checkPermission(required: string | string[] | undefined, userPermissions: string[]): boolean {
    if (!required) return true;
    const perms = Array.isArray(required) ? required : [required];
    return perms.some((p) => userPermissions.includes(p));
}

// ─── Filter navigation by user permissions ──────────────

export function filterNavigation(groups: NavGroup[], userPermissions: string[]): NavGroup[] {
    return groups
        .map((group) => {
            // Filter group-level permission
            if (!checkPermission(group.permission, userPermissions)) return null;

            // Filter items
            const filteredItems = group.items
                .map((item) => {
                    if (!checkPermission(item.permission, userPermissions)) return null;

                    // Filter sub-items
                    if (item.items) {
                        const filteredSubItems = item.items.filter((sub) => checkPermission(sub.permission, userPermissions));
                        if (filteredSubItems.length === 0 && item.permission) {
                            // Jika tidak ada sub-item yang bisa diakses,
                            // tapi parent punya permission, tetap tampilkan parent
                            return { ...item, items: undefined };
                        }
                        return { ...item, items: filteredSubItems };
                    }

                    return item;
                })
                .filter(Boolean) as NavItem[];

            if (filteredItems.length === 0) return null;

            return { ...group, items: filteredItems };
        })
        .filter(Boolean) as NavGroup[];
}

// ─── Navigation Definition ──────────────────────────────

export const NAVIGATION_ITEMS: NavGroup[] = [
    // ═══════════════════════════════════════════════════════
    // SECTION: ADMIN — Kelola Sistem
    // ═══════════════════════════════════════════════════════
    {
        label: 'Kelola Sistem',
        permission: 'user.view-any',
        items: [
            {
                title: 'Dashboard Admin',
                url: route('admin.dashboard'),
                icon: Gauge,
                permission: 'user.view-any',
                exact: true,
            },
            {
                title: 'Pengguna',
                url: route('admin.users.index'),
                icon: Users,
                permission: 'user.view-any',
                items: [
                    {
                        title: 'Daftar Pengguna',
                        url: route('admin.users.index'),
                        icon: ListTodo,
                        permission: 'user.view-any',
                    },
                    {
                        title: 'Tambah Pengguna',
                        url: route('admin.users.create'),
                        icon: UserCog,
                        permission: 'user.create',
                    },
                ],
            },
            {
                title: 'Semua Karya',
                url: route('admin.works.index'),
                icon: BookText,
                permission: 'work.view-any',
                items: [
                    {
                        title: 'Aktif',
                        url: route('admin.works.index'),
                        icon: ListTodo,
                        permission: 'work.view-any',
                    },
                    // TODO: disabled for now
                    // {
                    //     title: 'Dihapus (Trash)',
                    //     url: route('admin.works.trashed'),
                    //     icon: Trash2,
                    //     permission: 'work.view-any',
                    // },
                ],
            },
            {
                title: 'Master Data',
                url: '#',
                icon: FolderOpen,
                permission: 'setting.manage',
                items: [
                    {
                        title: 'Departemen',
                        url: route('admin.departments.index'),
                        icon: Building2, // berbeda dari Kategori
                        permission: 'setting.manage',
                    },
                    {
                        title: 'Kategori Karya',
                        url: route('admin.work-categories.index'),
                        icon: Layers, // berbeda dari Departemen
                        permission: 'setting.manage',
                    },
                ],
            },
            {
                title: 'Laporan',
                url: route('admin.reports.index'),
                icon: BarChart3,
                permission: 'report.export',
            },
        ],
    },

    // ═══════════════════════════════════════════════════════
    // SECTION: DOSEN — Review & Penilaian
    // ═══════════════════════════════════════════════════════
    {
        label: 'Review & Penilaian',
        permission: 'work.review',
        items: [
            {
                title: 'Dashboard Dosen',
                url: route('lecturer.dashboard'),
                icon: Gauge,
                permission: 'work.review',
                exact: true,
            },
            {
                title: 'Antrian Review',
                url: route('lecturer.reviews.pending'),
                icon: Inbox,
                permission: 'work.review',
                badge: '5', // nanti di-populate dari backend
                badgeColor: 'red',
            },
            {
                title: 'Sedang Direview',
                url: route('lecturer.reviews.pending'),
                icon: FileCheck2,
                permission: 'work.review',
            },
            {
                title: 'Riwayat Review',
                url: route('lecturer.reviews.history'),
                icon: FileSearch,
                permission: 'work.review',
            },
        ],
    },

    // ═══════════════════════════════════════════════════════
    // SECTION: MAHASISWA — Manajemen Karya
    // ═══════════════════════════════════════════════════════
    {
        label: 'Karya Tulis',
        permission: 'work.view-own',
        items: [
            {
                title: 'Dashboard',
                url: route('student.dashboard'),
                icon: Gauge,
                permission: 'work.view-own',
                exact: true,
            },
            {
                title: 'Karya Saya',
                url: route('student.works.index'),
                icon: BookOpen,
                permission: 'work.view-own',
                items: [
                    {
                        title: 'Semua Karya',
                        url: route('student.works.index'),
                        icon: ListTodo,
                        permission: 'work.view-own',
                    },
                    {
                        title: 'Upload Baru',
                        url: route('student.works.create'),
                        icon: Upload,
                        permission: 'work.create',
                    },
                ],
            },
            {
                title: 'Status Review',
                url: route('student.works.index'),
                icon: FileClock,
                permission: 'work.view-own',
            },
        ],
    },
];
