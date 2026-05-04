# GitHub Copilot Instructions - Repository KTI

# Stack: Laravel 12 + Inertia 3 + React 19 (TypeScript) + Spatie Permission + Fortify

# Generated: 2026-05-04

---

## Project Overview

Repository Karya Tulis Ilmiah (Skripsi & KTI) adalah platform digital berbasis web untuk menyimpan, mengelola, dan mempublikasikan karya tulis akademik student.

### Tech Stack

- **Backend**: Laravel 12 (PHP 8.3+)
- **Frontend Bridge**: Inertia.js 3
- **Frontend**: React 19 + TypeScript
- **Auth**: Laravel Fortify (headless, hanya login untuk sekarang)
- **Authorization**: Spatie Laravel Permission
- **Styling**: Tailwind CSS (diasumsikan)
- **Icons**: Lucide React
- **Soft Delete**: Laravel SoftDeletes trait (WAJIB untuk semua tabel utama)

---

## CRITICAL: Naming Conventions (WAJIB DIPATUHI)

### File & Folder Names: KEBAB-CASE

```
✅ BENAR:
  resources/js/pages/auth/login.tsx
  resources/js/components/ui/status-badge.tsx
  resources/js/hooks/use-permission.ts
  resources/js/lib/permissions.ts
  app/Http/Controllers/Mahasiswa/WorkController.php

❌ SALAH:
  resources/js/pages/Auth/Login.tsx
  resources/js/components/ui/StatusBadge.tsx
  resources/js/hooks/usePermission.ts
```

### React Components: PASCAL CASE

```tsx
// File: status-badge.tsx
// Component name: PascalCase
export default function StatusBadge() {}
export function Can() {}
```

### Functions (non-component): CAMEL CASE

```ts
export function usePermission() {}
export function can() {}
export function handleSubmit() {}
```

### Variables: CAMEL CASE

```ts
const workData = [];
const isLoading = false;
const fullFilePath = '';
```

### Constants: UPPER_SNAKE_CASE

```ts
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = ['application/pdf'];
```

### Types & Interfaces: PASCAL CASE

```ts
type Permission = 'work.create' | 'work.review';
interface WorkProps {}
enum WorkStatus {}
```

### Laravel (PHP)

- **Classes**: PascalCase → `WorkController`, `WorkUploadService`
- **Methods**: camelCase → `store()`, `assignReviewer()`
- **Variables**: camelCase → `$filePath`, `$workData`
- **Database tables**: snake_case plural → `work_chapters`, `work_reviews`
- **Migration columns**: snake_case → `full_file_path`, `chapter_number`

---

## CRITICAL: Project Structure

### Frontend (resources/js/)

```
resources/js/
├── app.tsx                         # Inertia app entry
├── pages/                          # ALL kebab-case
│   ├── auth/
│   │   └── login.tsx               # Only login enabled (Fortify)
│   ├── student/
│   │   ├── dashboard.tsx
│   │   ├── works/
│   │   │   ├── index.tsx
│   │   │   ├── create.tsx
│   │   │   ├── edit.tsx
│   │   │   └── show.tsx
│   │   └── works-chapters/
│   │       └── index.tsx
│   ├── lecturer/
│   │   ├── dashboard.tsx
│   │   └── reviews/
│   │       ├── pending.tsx
│   │       └── history.tsx
│   ├── admin/
│   │   ├── dashboard.tsx
│   │   ├── users/
│   │   │   └── index.tsx
│   │   ├── works/
│   │   │   └── index.tsx
│   │   ├── departments/
│   │   │   └── index.tsx
│   │   ├── work-categories/
│   │   │   └── index.tsx
│   │   └── reports/
│   │       └── index.tsx
│   └── public-pages/
│       ├── home.tsx
│       ├── search.tsx
│       ├── work-detail.tsx
│       └── work-preview.tsx
├── components/                     # ALL kebab-case
│   ├── ui/
│   │   ├── input.tsx
│   │   ├── button.tsx
│   │   ├── label.tsx
│   │   ├── status-badge.tsx
│   │   └── file-uploader.tsx
│   ├── pdf-viewer.tsx
│   ├── work-card.tsx
│   ├── permissions.tsx             # Can, HasRole components
│   └── layouts/
│       ├── app-layout.tsx
│       ├── guest-layout.tsx
│       └── admin-layout.tsx
├── hooks/                          # ALL kebab-case
│   └── use-permission.ts
├── lib/                            # ALL kebab-case
│   └── permissions.ts
├── types/                          # ALL kebab-case
│   ├── index.d.ts                  # PageProps, AuthData
│   ├── work.d.ts
│   ├── user.d.ts
│   └── department.d.ts
└── utils/                          # ALL kebab-case
    └── helpers.ts
```

### Backend (app/)

```
app/
├── Enums/
│   ├── WorkStatus.php              # draft, pending_review, in_review, revision, approved, published, rejected
│   ├── WorkVisibility.php          # public, restricted
│   └── ReviewAction.php            # assigned, in_review, approved, rejected, revision
├── Models/
│   ├── User.php
│   ├── Work.php
│   ├── WorkChapter.php
│   ├── WorkReview.php
│   ├── Department.php
│   ├── Faculty.php
│   └── WorkCategory.php
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   │   └── LoginController.php
│   │   ├── Mahasiswa/
│   │   │   ├── DashboardController.php
│   │   │   └── WorkController.php
│   │   ├── lecturer/
│   │   │   ├── DashboardController.php
│   │   │   └── ReviewController.php
│   │   ├── Admin/
│   │   │   ├── DashboardController.php
│   │   │   ├── UserController.php
│   │   │   ├── WorkController.php
│   │   │   ├── DepartmentController.php
│   │   │   ├── WorkCategoryController.php
│   │   │   └── ReportController.php
│   │   └── Public/
│   │       ├── HomeController.php
│   │       ├── SearchController.php
│   │       └── WorkController.php
│   ├── Requests/
│   │   ├── StoreWorkRequest.php
│   │   ├── UpdateWorkRequest.php
│   │   └── ReviewWorkRequest.php
│   └── Policies/
│       └── WorkPolicy.php
├── Services/
│   ├── WorkUploadService.php
│   └── FileStorageService.php
└── Actions/
    └── Fortify/
        └── CreateNewUser.php       # Modified for KTI
```

---

## CRITICAL: Auth & Permission Patterns

### Roles (Hanya 3, tidak ada super-admin)

- `admin` - Full access
- `lecturer` - Reviewer access
- `student` - Student access

### Permission List (Frontend)

```ts
type Permission =
    | 'user.view-any'
    | 'user.create'
    | 'user.update'
    | 'user.delete'
    | 'work.view-any'
    | 'work.view-own'
    | 'work.create'
    | 'work.update-own'
    | 'work.delete-own'
    | 'work.submit'
    | 'work.review'
    | 'work.approve'
    | 'work.reject'
    | 'work.publish'
    | 'work.assign-reviewer'
    | 'report.export'
    | 'setting.manage';
```

### Using Permission Hook

```tsx
import { usePermission } from '@/hooks/use-permission';

const { can, hasRole, isAdmin, islecturer, isMahasiswa, canEditWork, canReviewWork, user } = usePermission();

// Check single permission
if (can('work.create')) {
}

// Check multiple permissions (OR logic)
if (can(['work.approve', 'work.reject'])) {
}

// Check role
if (hasRole('admin')) {
}
if (islecturer()) {
}

// Business logic helpers
if (canEditWork(work.status, work.author_id === user?.id)) {
}
if (canReviewWork(work.status)) {
}
```

### Using Permission Components

```tsx
import { Can, HasRole, Authenticated } from '@/components/permissions';

<Can permission="work.create">
  <Button>Upload Karya</Button>
</Can>

<Can permission={['work.approve', 'work.reject']} fallback={<p>No access</p>}>
  <ReviewPanel />
</Can>

<HasRole role={['admin', 'lecturer']}>
  <ReviewerMenu />
</HasRole>

<Authenticated fallback={<LoginPrompt />}>
  <UserMenu />
</Authenticated>
```

### Standalone Helpers (non-React)

```ts
import { can, hasRole, isAdmin, islecturer, isMahasiswa } from '@/lib/permissions';

// Use outside React components
const hasAccess = can('work.create', userPermissions);
const isUserAdmin = isAdmin(userRoles);
```

---

## CRITICAL: Laravel Fortify Config (Hanya Login)

Fortify hanya meng-handle login. Fitur lain dimatikan.

```php
// config/fortify.php
'features' => [
    // Features::registration(),           // ❌ Disabled
    // Features::resetPasswords(),         // ❌ Disabled
    // Features::emailVerification(),      // ❌ Disabled
    // Features::updateProfileInformation(), // ❌ Disabled
    // Features::updatePasswords(),        // ❌ Disabled
    // Features::twoFactorAuthentication(), // ❌ Disabled
],
```

```php
// app/Providers/FortifyServiceProvider.php
Fortify::loginView(function () {
    return Inertia::render('auth/login');  // kebab-case path
});
// All other views disabled
```

---

## CRITICAL: Work Status Lifecycle

Status karya MUTLAK mengikuti alur ini:

```
draft → pending_review → in_review → approved → published
                          ↓
                    revision → (loop to pending_review)
                          ↓
                    rejected (end)
```

### Status Enum (PHP)

```php
enum WorkStatus: string
{
    case DRAFT = 'draft';
    case PENDING_REVIEW = 'pending_review';
    case IN_REVIEW = 'in_review';
    case REVISION = 'revision';
    case APPROVED = 'approved';
    case PUBLISHED = 'published';
    case REJECTED = 'rejected';
}
```

### Status Transitions (Who can change)

| From           | To             | Changed By              |
| -------------- | -------------- | ----------------------- |
| draft          | pending_review | Mahasiswa (submit)      |
| pending_review | in_review      | Admin (assign reviewer) |
| in_review      | approved       | lecturer                |
| in_review      | revision       | lecturer                |
| in_review      | rejected       | lecturer / Admin        |
| approved       | published      | Admin                   |
| revision       | pending_review | Mahasiswa (re-upload)   |

---

## CRITICAL: Soft Delete Implementation

### WAJIB: Semua tabel utama menggunakan SoftDeletes

Tabel yang WAJIB pakai SoftDeletes:

- `users`
- `faculties`
- `departments`
- `work_categories`
- `works`
- `work_chapters`
- `work_reviews`
- `activity_logs`

### Migration Pattern (Tambah soft deletes)

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('works', function (Blueprint $table) {
            $table->id();
            // ... semua kolom lain
            $table->timestamps();
            $table->softDeletes(); // ← WAJIB ADA
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('works');
    }
};
```

### Model Pattern (Use SoftDeletes trait)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // ← Import ini

class Work extends Model
{
    use HasFactory, SoftDeletes; // ← Tambahkan SoftDeletes

    protected $fillable = [
        'category_id',
        'department_id',
        'author_id',
        'supervisor_id',
        'title',
        'abstract',
        'keywords',
        'year',
        'language',
        'full_file_path',
        'full_file_size',
        'status',
        'visibility',
        'view_count',
        'download_count',
        'published_at',
        'submitted_at',
    ];

    protected $casts = [
        'keywords' => 'array',
        'published_at' => 'datetime',
        'submitted_at' => 'datetime',
        'status' => WorkStatus::class,
        'visibility' => WorkVisibility::class,
    ];

    // ─── Default: exclude soft deleted ─────────────────
    // Laravel otomatis exclude soft deleted records

    // ─── Include soft deleted (jika perlu) ──────────────
    // Work::withTrashed()->get();
    // Work::onlyTrashed()->get();

    // ─── Restore soft deleted ───────────────────────────
    // $work->restore();

    // ─── Force delete (permanen) ────────────────────────
    // $work->forceDelete();

    // ─── Relationships ──────────────────────────────────
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function chapters()
    {
        return $this->hasMany(WorkChapter::class);
    }

    public function reviews()
    {
        return $this->hasMany(WorkReview::class);
    }

    public function category()
    {
        return $this->belongsTo(WorkCategory::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
```

### User Model with SoftDeletes

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, HasRoles, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'nim',
        'nidn',
        'phone',
        'avatar',
        'department_id',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    // ─── Soft Delete Logic ──────────────────────────────
    // Saat user di-soft-delete:
    // 1. Akun tidak bisa login
    // 2. Karya tulis tetap ada (tidak ikut dihapus)
    // 3. Relasi ke karya tetap terjaga

    public function works()
    {
        return $this->hasMany(Work::class, 'author_id');
    }

    public function supervisedWorks()
    {
        return $this->hasMany(Work::class, 'supervisor_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function reviews()
    {
        return $this->hasMany(WorkReview::class, 'reviewer_id');
    }
}
```

### Controller Pattern with Soft Delete

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkController extends Controller
{
    // ─── List (exclude soft deleted by default) ─────────
    public function index()
    {
        $works = Work::with(['author', 'category', 'department'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/works/index', [
            'works' => $works,
        ]);
    }

    // ─── List including soft deleted ────────────────────
    public function trashed()
    {
        $works = Work::onlyTrashed()
            ->with(['author', 'category', 'department'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/works/trashed', [
            'works' => $works,
        ]);
    }

    // ─── Soft delete ────────────────────────────────────
    public function destroy(Work $work)
    {
        $this->authorize('delete', $work);

        // Hanya bisa soft delete jika status draft
        if ($work->status !== WorkStatus::DRAFT) {
            return redirect()->back()
                ->with('error', 'Hanya karya dengan status draft yang bisa dihapus.');
        }

        $work->delete(); // Soft delete

        return redirect()->back()
            ->with('success', 'Karya berhasil dihapus.');
    }

    // ─── Restore soft deleted ───────────────────────────
    public function restore($id)
    {
        $work = Work::withTrashed()->findOrFail($id);
        $this->authorize('restore', $work);

        $work->restore();

        return redirect()->back()
            ->with('success', 'Karya berhasil dikembalikan.');
    }

    // ─── Force delete (permanent) ───────────────────────
    public function forceDelete($id)
    {
        $work = Work::withTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $work);

        // Hapus file fisik dari storage
        if ($work->full_file_path) {
            Storage::disk('local')->delete($work->full_file_path);
        }

        // Hapus file chapters
        foreach ($work->chapters as $chapter) {
            Storage::disk('local')->delete($chapter->file_path);
            $chapter->forceDelete();
        }

        $work->forceDelete(); // Permanent delete

        return redirect()->back()
            ->with('success', 'Karya berhasil dihapus permanen.');
    }
}
```

### Policy with Soft Delete

```php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Work;

class WorkPolicy
{
    // ─── View any (exclude soft deleted) ────────────────
    public function viewAny(User $user): bool
    {
        return $user->can('work.view-any');
    }

    // ─── View (exclude soft deleted) ────────────────────
    public function view(User $user, Work $work): bool
    {
        if ($user->can('work.view-any')) return true;
        if ($user->can('work.view-own') && $work->author_id === $user->id) return true;
        return false;
    }

    // ─── Create ─────────────────────────────────────────
    public function create(User $user): bool
    {
        return $user->can('work.create');
    }

    // ─── Update (hanya draft) ───────────────────────────
    public function update(User $user, Work $work): bool
    {
        if ($work->status !== WorkStatus::DRAFT) return false;
        if ($user->can('work.update-own') && $work->author_id === $user->id) return true;
        return false;
    }

    // ─── Soft Delete (hanya draft) ──────────────────────
    public function delete(User $user, Work $work): bool
    {
        if ($work->status !== WorkStatus::DRAFT) return false;
        if ($user->can('work.delete-own') && $work->author_id === $user->id) return true;
        if ($user->can('work.delete-own') && $user->hasRole('admin')) return true;
        return false;
    }

    // ─── Restore soft deleted ───────────────────────────
    public function restore(User $user, Work $work): bool
    {
        return $user->hasRole('admin');
    }

    // ─── Force delete (permanent) ───────────────────────
    public function forceDelete(User $user, Work $work): bool
    {
        return $user->hasRole('admin');
    }

    // ─── Submit for review ──────────────────────────────
    public function submit(User $user, Work $work): bool
    {
        if ($work->status !== WorkStatus::DRAFT) return false;
        if ($work->author_id !== $user->id) return false;
        return $user->can('work.submit');
    }

    // ─── Review ─────────────────────────────────────────
    public function review(User $user, Work $work): bool
    {
        if (!in_array($work->status, [WorkStatus::PENDING_REVIEW, WorkStatus::IN_REVIEW])) {
            return false;
        }
        return $user->can('work.review');
    }
}
```

### Route Pattern with Soft Delete

```php
<?php

use App\Http\Controllers\Admin\WorkController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // Standard CRUD (soft delete)
    Route::get('/works', [WorkController::class, 'index'])->name('admin.works.index');
    Route::get('/works/trashed', [WorkController::class, 'trashed'])->name('admin.works.trashed');
    Route::delete('/works/{work}', [WorkController::class, 'destroy'])->name('admin.works.destroy');

    // Restore & Force Delete
    Route::post('/works/{id}/restore', [WorkController::class, 'restore'])->name('admin.works.restore');
    Route::delete('/works/{id}/force-delete', [WorkController::class, 'forceDelete'])->name('admin.works.force-delete');
});
```

### React Component with Soft Delete UI

```tsx
// resources/js/pages/admin/works/index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/use-permission';
import { Can } from '@/components/permissions';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';

interface Work {
    id: string;
    title: string;
    status: string;
    author: { name: string };
    deleted_at: string | null; // ← Soft delete indicator
}

interface Props {
    works: { data: Work[] };
}

export default function WorksIndex({ works }: Props) {
    const { can } = usePermission();

    const handleSoftDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus karya ini? Karya bisa dikembalikan nanti.')) {
            router.delete(`/admin/works/${id}`);
        }
    };

    const handleRestore = (id: string) => {
        router.post(`/admin/works/${id}/restore`);
    };

    const handleForceDelete = (id: string) => {
        if (confirm('PERINGATAN: Penghapusan permanen! File PDF akan dihapus selamanya. Lanjutkan?')) {
            router.delete(`/admin/works/${id}/force-delete`);
        }
    };

    return (
        <div>
            <Head title="Kelola Karya" />
            <h1 className="text-2xl font-bold">Kelola Karya</h1>

            <table className="w-full">
                <thead>
                    <tr>
                        <th>Judul</th>
                        <th>Penulis</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {works.data.map((work) => (
                        <tr key={work.id} className={work.deleted_at ? 'bg-red-50' : ''}>
                            <td>
                                {work.title}
                                {work.deleted_at && <span className="ml-2 text-xs text-red-600">(Dihapus)</span>}
                            </td>
                            <td>{work.author.name}</td>
                            <td>{work.status}</td>
                            <td className="space-x-2">
                                {!work.deleted_at ? (
                                    <>
                                        {/* Soft delete */}
                                        <Can permission="work.delete-own">
                                            <Button variant="destructive" size="sm" onClick={() => handleSoftDelete(work.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </Can>
                                    </>
                                ) : (
                                    <>
                                        {/* Restore */}
                                        <Can permission="work.delete-own">
                                            <Button variant="outline" size="sm" onClick={() => handleRestore(work.id)}>
                                                <RotateCcw className="h-4 w-4" />
                                            </Button>
                                        </Can>

                                        {/* Force delete */}
                                        <Can permission="work.delete-own">
                                            <Button variant="destructive" size="sm" onClick={() => handleForceDelete(work.id)}>
                                                <AlertTriangle className="h-4 w-4" />
                                            </Button>
                                        </Can>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

---

## CRITICAL: File Upload Rules

### Allowed

- **Format**: PDF ONLY (`application/pdf`)
- **Max size**: 50 MB per file
- **Storage**: Laravel Storage (local/S3-compatible)
- **Path**: `storage/app/works/` (NOT public directly)
- **Filename**: Auto-generated by system
- **Access**: Signed URL for download

### Validation

```php
$request->validate([
    'full_file' => ['required', 'file', 'mimes:pdf', 'max:51200'], // 50MB in KB
    'chapter_files.*' => ['required', 'file', 'mimes:pdf', 'max:51200'],
]);
```

### React Upload Component

```tsx
<FileUploader accept="application/pdf" maxSize={50 * 1024 * 1024} onUpload={handleUpload} />
```

---

## CRITICAL: Inertia Page Resolution

Pages di-resolve dengan kebab-case path:

```tsx
// resources/js/app.tsx
resolve: (name) => resolvePageComponent(
    `./pages/${name}.tsx`,        // ← kebab-case
    import.meta.glob('./pages/**/*.tsx')
),
```

Contoh pemanggilan dari Laravel:

```php
// Controller
return Inertia::render('student/works/create');  // kebab-case
return Inertia::render('admin/work-categories/index');
return Inertia::render('public-pages/work-detail');
```

---

## Database Schema Reference

### Key Tables

| Table                | Purpose               | SoftDelete          |
| -------------------- | --------------------- | ------------------- |
| users                | Auth users            | ✅                  |
| faculties            | Fakultas              | ✅                  |
| departments          | Program studi         | ✅                  |
| work_categories      | Skripsi, KTI, Tesis   | ✅                  |
| works                | Main works table      | ✅                  |
| work_chapters        | Per-bab PDF files     | ✅                  |
| work_reviews         | Review history        | ✅                  |
| activity_logs        | System activity       | ✅                  |
| roles                | Spatie roles          | ❌ (Spatie default) |
| permissions          | Spatie permissions    | ❌ (Spatie default) |
| model_has_roles      | User-role pivot       | ❌ (Spatie default) |
| role_has_permissions | Role-permission pivot | ❌ (Spatie default) |

### Key Columns (works table)

- `status`: enum (draft|pending_review|in_review|revision|approved|published|rejected)
- `visibility`: enum (public|restricted), default: public
- `keywords`: JSON array
- `full_file_path`: varchar(500), nullable
- `full_file_size`: bigint, nullable
- `view_count`: bigint, default 0
- `download_count`: bigint, default 0
- `published_at`: timestamp, nullable
- `submitted_at`: timestamp, nullable
- `deleted_at`: timestamp, nullable ← SoftDeletes

---

## Coding Patterns

### Laravel Controller Pattern

```php
<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWorkRequest;
use App\Models\Work;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WorkController extends Controller
{
    public function index()
    {
        $works = Work::where('author_id', Auth::id())
            ->with('category', 'department')
            ->latest()
            ->paginate(10);

        return Inertia::render('student/works/index', [
            'works' => $works,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Work::class);

        return Inertia::render('student/works/create');
    }

    public function store(StoreWorkRequest $request)
    {
        $validated = $request->validated();
        // ... logic

        return redirect()->route('student.works.index')
            ->with('success', 'Karya berhasil disimpan sebagai draft.');
    }
}
```

### React Page Pattern

```tsx
// resources/js/pages/student/works/index.tsx
import { Head, Link } from '@inertiajs/react';
import { usePermission } from '@/hooks/use-permission';
import { Can } from '@/components/permissions';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layouts/app-layout';

interface Props {
    works: {
        data: Array<{
            id: string;
            title: string;
            status: string;
            created_at: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function WorksIndex({ works }: Props) {
    const { can } = usePermission();

    return (
        <AppLayout>
            <Head title="Daftar Karya" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Daftar Karya Saya</h1>

                    <Can permission="work.create">
                        <Link href="/student/works/create">
                            <Button>Upload Karya Baru</Button>
                        </Link>
                    </Can>
                </div>

                {/* Works list */}
            </div>
        </AppLayout>
    );
}
```

### TypeScript Type Pattern

```ts
// resources/js/types/work.d.ts
import { WorkStatus } from '@/lib/permissions';

export interface Work {
    id: string;
    title: string;
    abstract: string;
    keywords: string[];
    year: number;
    language: 'id' | 'en';
    status: WorkStatus;
    visibility: 'public' | 'restricted';
    full_file_path: string | null;
    full_file_size: number | null;
    view_count: number;
    download_count: number;
    published_at: string | null;
    submitted_at: string | null;
    deleted_at: string | null; // ← Soft delete
    created_at: string;
    updated_at: string;
    category: WorkCategory;
    department: Department;
    author: User;
    supervisor: User | null;
}

export interface WorkCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}
```

### Service Pattern (Laravel)

```php
<?php

namespace App\Services;

use App\Models\Work;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class WorkUploadService
{
    public function storeFullFile(Work $work, UploadedFile $file): string
    {
        $fileName = $this->generateFileName($file);
        $path = $file->storeAs('works/' . $work->id, $fileName, 'local');

        return $path;
    }

    public function storeChapterFile(Work $work, UploadedFile $file, int $chapterNumber): string
    {
        $fileName = "chapter-{$chapterNumber}-" . $this->generateFileName($file);
        $path = $file->storeAs('works/' . $work->id . '/chapters', $fileName, 'local');

        return $path;
    }

    private function generateFileName(UploadedFile $file): string
    {
        return uniqid() . '_' . time() . '.' . $file->getClientOriginalExtension();
    }

    public function deleteFile(string $path): bool
    {
        return Storage::disk('local')->delete($path);
    }
}
```

---

## Response Format Rules

### Laravel Success Response

```php
return redirect()->back()->with('success', 'Pesan sukses');
return redirect()->route('route.name')->with('success', 'Pesan sukses');
```

### Laravel Error Response

```php
return redirect()->back()->with('error', 'Pesan error')->withInput();
```

### Flash Messages di Inertia

```tsx
// Akses flash messages
const { flash } = usePage<PageProps>().props;

// Tampilkan toast/alert
{
    flash?.success && <Alert type="success">{flash.success}</Alert>;
}
{
    flash?.error && <Alert type="error">{flash.error}</Alert>;
}
```

---

## Security Guidelines

1. **File Storage**: Selalu pakai `Storage::disk('local')`, jangan simpan di public
2. **Download**: Gunakan signed URL atau stream via controller
3. **Validation**: Server-side MIME type validation WAJIB
4. **CSRF**: Inertia handle otomatis, tapi tetap validasi
5. **Rate Limiting**: Apply di upload dan auth endpoints
6. **Authorization**: Selalu gunakan Policy/Gate, jangan cek role manual di controller
7. **Input Sanitization**: Sanitize semua user input
8. **Soft Delete**: Jangan expose soft deleted data ke public endpoint

---

## Common Pitfalls to Avoid

1. ❌ Jangan pakai PascalCase untuk nama file/folder di `resources/js/`
2. ❌ Jangan asumsikan ada super-admin (tidak ada di sistem ini)
3. ❌ Jangan simpan file PDF di folder public langsung
4. ❌ Jangan lupa validasi MIME type di server-side
5. ❌ Jangan bypass Policy dengan cek role manual
6. ❌ Jangan lupa handle `auth.user` null di permission components
7. ❌ Jangan pakai `any` type di TypeScript kecuali benar-benar perlu
8. ❌ Jangan lupa tambahkan `Head` dari Inertia untuk setiap page title
9. ❌ Jangan lupa tambahkan `$table->softDeletes()` di migration
10. ❌ Jangan lupa `use SoftDeletes` di Model
11. ❌ Jangan force delete tanpa konfirmasi dan backup file
12. ❌ Jangan expose soft deleted records ke endpoint public

---

## Language

- **Code**: English (variables, functions, classes)
- **UI Labels**: Indonesian (sesuai kebutuhan user)
- **Comments**: Indonesian atau English tapi konsisten
- **Database**: English (table names, column names)
- **Route names**: kebab-case English → `student.works.index`

---

## When Generating Code, Always:

1. ✅ Gunakan kebab-case untuk semua file/folder path
2. ✅ Gunakan PascalCase untuk React components
3. ✅ Gunakan camelCase untuk functions dan variables
4. ✅ Import type dari `@/lib/permissions` untuk Permission dan Role
5. ✅ Import `usePermission` dari `@/hooks/use-permission`
6. ✅ Import permission components dari `@/components/permissions`
7. ✅ Gunakan `PageProps` dari `@/types` untuk type page props
8. ✅ Handle `auth.user` null case di permission checks
9. ✅ Gunakan Policy untuk authorization di backend
10. ✅ Validasi file PDF di server-side
11. ✅ Generate filename otomatis untuk uploaded files
12. ✅ Simpan file di storage non-public
13. ✅ Tambahkan SoftDeletes di migration dan model
14. ✅ Handle restore dan force delete di admin panel
15. ✅ Hapus file fisik saat force delete
16. ✅ Gunakan Inertia untuk page rendering
