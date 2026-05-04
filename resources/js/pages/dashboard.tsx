import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AdminLayout header={<h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </AdminLayout>
    );
}
