# GitHub Copilot Instructions - Repository KTI

# Stack: Laravel 12 + Inertia 3 + React 19 (TypeScript) + Spatie Permission + Fortify

# Generated: 2026-05-04

---

## Project Overview

Repository Karya Tulis Ilmiah (Skripsi & KTI) adalah platform digital berbasis web untuk menyimpan, mengelola, dan mempublikasikan karya tulis akademik student.

### Tech Stack

-**Backend**: Laravel 12 (PHP 8.3+)

-**Frontend Bridge**: Inertia.js 3

-**Frontend**: React 19 + TypeScript

-**Auth**: Laravel Fortify (headless, hanya login untuk sekarang)

-**Authorization**: Spatie Laravel Permission

-**Styling**: Tailwind CSS (diasumsikan)

-**Icons**: Lucide React

-**Soft Delete**: Laravel SoftDeletes trait (WAJIB untuk semua tabel utama)

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

exportdefaultfunctionStatusBadge() {}

exportfunctionCan() {}

```

### Functions (non-component): CAMEL CASE

```ts

exportfunctionusePermission() {}

exportfunctioncan() {}

exportfunctionhandleSubmit() {}

```

### Variables: CAMEL CASE

```ts
constworkData = [];

constisLoading = false;

constfullFilePath = '';
```

### Constants: UPPER_SNAKE_CASE

```ts
constMAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

constALLOWED_MIME_TYPES = ['application/pdf'];
```

### Types & Interfaces: PASCAL CASE

```ts

typePermission = 'work.create' | 'work.review';

interfaceWorkProps {}

enumWorkStatus {}

```

### Laravel (PHP)

-**Classes**: PascalCase → `WorkController`, `WorkUploadService`

-**Methods**: camelCase → `store()`, `assignReviewer()`

-**Variables**: camelCase → `$filePath`, `$workData`

-**Database tables**: snake_case plural → `work_chapters`, `work_reviews`

-**Migration columns**: snake_case → `full_file_path`, `chapter_number`

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

-`admin` - Full access

-`lecturer` - Reviewer access

-`student` - Student access

### Permission List (Frontend)

```ts

typePermission =

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

import { Can, HasRole, Authenticated } from'@/components/permissions';


<Canpermission="work.create">

  <Button>Upload Karya</Button>

</Can>


<Canpermission={['work.approve', 'work.reject']}fallback={<p>No access</p>}>

  <ReviewPanel />

</Can>


<HasRolerole={['admin', 'lecturer']}>

  <ReviewerMenu />

</HasRole>


<Authenticatedfallback={<LoginPrompt />}>

  <UserMenu />

</Authenticated>

```

### Standalone Helpers (non-React)

```ts
import { can, hasRole, isAdmin, islecturer, isMahasiswa } from '@/lib/permissions';

// Use outside React components

consthasAccess = can('work.create', userPermissions);

constisUserAdmin = isAdmin(userRoles);
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

Fortify::loginView(function(){

returnInertia::render('auth/login');// kebab-case path

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

enumWorkStatus: string

{

caseDRAFT = 'draft';

casePENDING_REVIEW = 'pending_review';

caseIN_REVIEW = 'in_review';

caseREVISION = 'revision';

caseAPPROVED = 'approved';

casePUBLISHED = 'published';

caseREJECTED = 'rejected';

}

```

### Status Transitions (Who can change)

| From | To | Changed By |

| -------------- | -------------- | ----------------------- |

| draft | pending_review | Mahasiswa (submit) |

| pending_review | in_review | Admin (assign reviewer) |

| in_review | approved | lecturer |

| in_review | revision | lecturer |

| in_review | rejected | lecturer / Admin |

| approved | published | Admin |

| revision | pending_review | Mahasiswa (re-upload) |

---

## CRITICAL: Soft Delete Implementation

### WAJIB: Semua tabel utama menggunakan SoftDeletes

Tabel yang WAJIB pakai SoftDeletes:

-`users`

-`faculties`

-`departments`

-`work_categories`

-`works`

-`work_chapters`

-`work_reviews`

-`activity_logs`

### Migration Pattern (Tambah soft deletes)

```php

<?php


useIlluminate\Database\Migrations\Migration;

useIlluminate\Database\Schema\Blueprint;

useIlluminate\Support\Facades\Schema;


returnnewclassextendsMigration

{

publicfunctionup(): void

{

Schema::create('works',function(Blueprint$table){

$table->id();

// ... semua kolom lain

$table->timestamps();

$table->softDeletes();// ← WAJIB ADA

});

}


publicfunctiondown(): void

{

Schema::dropIfExists('works');

}

};

```

### Model Pattern (Use SoftDeletes trait)

```php

<?php


namespaceApp\Models;


useIlluminate\Database\Eloquent\Factories\HasFactory;

useIlluminate\Database\Eloquent\Model;

useIlluminate\Database\Eloquent\SoftDeletes;// ← Import ini


classWorkextendsModel

{

useHasFactory,SoftDeletes;// ← Tambahkan SoftDeletes


protected$fillable = [

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


protected$casts = [

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

publicfunctionauthor()

{

return$this->belongsTo(User::class,'author_id');

}


publicfunctionsupervisor()

{

return$this->belongsTo(User::class,'supervisor_id');

}


publicfunctionchapters()

{

return$this->hasMany(WorkChapter::class);

}


publicfunctionreviews()

{

return$this->hasMany(WorkReview::class);

}


publicfunctioncategory()

{

return$this->belongsTo(WorkCategory::class);

}


publicfunctiondepartment()

{

return$this->belongsTo(Department::class);

}

}

```

### User Model with SoftDeletes

```php

<?php


namespaceApp\Models;


useIlluminate\Database\Eloquent\Factories\HasFactory;

useIlluminate\Foundation\Auth\UserasAuthenticatable;

useIlluminate\Database\Eloquent\SoftDeletes;

useSpatie\Permission\Traits\HasRoles;


classUserextendsAuthenticatable

{

useHasFactory,HasRoles,SoftDeletes;


protected$fillable = [

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


protected$hidden = [

'password',

'remember_token',

    ];


protected$casts = [

'email_verified_at' => 'datetime',

'password' => 'hashed',

'is_active' => 'boolean',

    ];


// ─── Soft Delete Logic ──────────────────────────────

// Saat user di-soft-delete:

// 1. Akun tidak bisa login

// 2. Karya tulis tetap ada (tidak ikut dihapus)

// 3. Relasi ke karya tetap terjaga


publicfunctionworks()

{

return$this->hasMany(Work::class,'author_id');

}


publicfunctionsupervisedWorks()

{

return$this->hasMany(Work::class,'supervisor_id');

}


publicfunctiondepartment()

{

return$this->belongsTo(Department::class);

}


publicfunctionreviews()

{

return$this->hasMany(WorkReview::class,'reviewer_id');

}

}

```

### Controller Pattern with Soft Delete

```php

<?php


namespaceApp\Http\Controllers\Admin;


useApp\Http\Controllers\Controller;

useApp\Models\Work;

useIlluminate\Http\Request;

useInertia\Inertia;


classWorkControllerextendsController

{

// ─── List (exclude soft deleted by default) ─────────

publicfunctionindex()

{

$works = Work::with(['author','category','department'])

            ->latest()

            ->paginate(20);


returnInertia::render('admin/works/index', [

'works' => $works,

        ]);

}


// ─── List including soft deleted ────────────────────

publicfunctiontrashed()

{

$works = Work::onlyTrashed()

            ->with(['author','category','department'])

            ->latest()

            ->paginate(20);


returnInertia::render('admin/works/trashed', [

'works' => $works,

        ]);

}


// ─── Soft delete ────────────────────────────────────

publicfunctiondestroy(Work$work)

{

$this->authorize('delete',$work);


// Hanya bisa soft delete jika status draft

if($work->status!==WorkStatus::DRAFT){

returnredirect()->back()

                ->with('error','Hanya karya dengan status draft yang bisa dihapus.');

}


$work->delete();// Soft delete


returnredirect()->back()

            ->with('success','Karya berhasil dihapus.');

}


// ─── Restore soft deleted ───────────────────────────

publicfunctionrestore($id)

{

$work = Work::withTrashed()->findOrFail($id);

$this->authorize('restore',$work);


$work->restore();


returnredirect()->back()

            ->with('success','Karya berhasil dikembalikan.');

}


// ─── Force delete (permanent) ───────────────────────

publicfunctionforceDelete($id)

{

$work = Work::withTrashed()->findOrFail($id);

$this->authorize('forceDelete',$work);


// Hapus file fisik dari storage

if($work->full_file_path){

Storage::disk('local')->delete($work->full_file_path);

}


// Hapus file chapters

foreach($work->chaptersas$chapter){

Storage::disk('local')->delete($chapter->file_path);

$chapter->forceDelete();

}


$work->forceDelete();// Permanent delete


returnredirect()->back()

            ->with('success','Karya berhasil dihapus permanen.');

}

}

```

### Policy with Soft Delete

```php

<?php


namespaceApp\Policies;


useApp\Models\User;

useApp\Models\Work;


classWorkPolicy

{

// ─── View any (exclude soft deleted) ────────────────

publicfunctionviewAny(User$user): bool

{

return$user->can('work.view-any');

}


// ─── View (exclude soft deleted) ────────────────────

publicfunctionview(User$user,Work$work): bool

{

if($user->can('work.view-any'))returntrue;

if($user->can('work.view-own')&&$work->author_id===$user->id)returntrue;

returnfalse;

}


// ─── Create ─────────────────────────────────────────

publicfunctioncreate(User$user): bool

{

return$user->can('work.create');

}


// ─── Update (hanya draft) ───────────────────────────

publicfunctionupdate(User$user,Work$work): bool

{

if($work->status!==WorkStatus::DRAFT)returnfalse;

if($user->can('work.update-own')&&$work->author_id===$user->id)returntrue;

returnfalse;

}


// ─── Soft Delete (hanya draft) ──────────────────────

publicfunctiondelete(User$user,Work$work): bool

{

if($work->status!==WorkStatus::DRAFT)returnfalse;

if($user->can('work.delete-own')&&$work->author_id===$user->id)returntrue;

if($user->can('work.delete-own')&&$user->hasRole('admin'))returntrue;

returnfalse;

}


// ─── Restore soft deleted ───────────────────────────

publicfunctionrestore(User$user,Work$work): bool

{

return$user->hasRole('admin');

}


// ─── Force delete (permanent) ───────────────────────

publicfunctionforceDelete(User$user,Work$work): bool

{

return$user->hasRole('admin');

}


// ─── Submit for review ──────────────────────────────

publicfunctionsubmit(User$user,Work$work): bool

{

if($work->status!==WorkStatus::DRAFT)returnfalse;

if($work->author_id!==$user->id)returnfalse;

return$user->can('work.submit');

}


// ─── Review ─────────────────────────────────────────

publicfunctionreview(User$user,Work$work): bool

{

if(!in_array($work->status,[WorkStatus::PENDING_REVIEW,WorkStatus::IN_REVIEW])){

returnfalse;

}

return$user->can('work.review');

}

}

```

### Route Pattern with Soft Delete

```php

<?php


useApp\Http\Controllers\Admin\WorkController;

useIlluminate\Support\Facades\Route;


Route::middleware(['auth','role:admin'])->prefix('admin')->group(function(){

// Standard CRUD (soft delete)

Route::get('/works', [WorkController::class,'index'])->name('admin.works.index');

Route::get('/works/trashed', [WorkController::class,'trashed'])->name('admin.works.trashed');

Route::delete('/works/{work}', [WorkController::class,'destroy'])->name('admin.works.destroy');


// Restore & Force Delete

Route::post('/works/{id}/restore', [WorkController::class,'restore'])->name('admin.works.restore');

Route::delete('/works/{id}/force-delete', [WorkController::class,'forceDelete'])->name('admin.works.force-delete');

});

```

### React Component with Soft Delete UI

```tsx

// resources/js/pages/admin/works/index.tsx

import { Head, Link, router } from'@inertiajs/react';

import { usePermission } from'@/hooks/use-permission';

import { Can } from'@/components/permissions';

import { Button } from'@/components/ui/button';

import { Trash2, RotateCcw, AlertTriangle } from'lucide-react';


interfaceWork {

id: string;

title: string;

status: string;

author: { name: string };

deleted_at: string | null; // ← Soft delete indicator

}


interfaceProps {

works: { data: Work[] };

}


exportdefaultfunctionWorksIndex({ works }: Props) {

const { can } = usePermission();


consthandleSoftDelete = (id: string) => {

if (confirm('Yakin ingin menghapus karya ini? Karya bisa dikembalikan nanti.')) {

router.delete(`/admin/works/${id}`);

        }

    };


consthandleRestore = (id: string) => {

router.post(`/admin/works/${id}/restore`);

    };


consthandleForceDelete = (id: string) => {

if (confirm('PERINGATAN: Penghapusan permanen! File PDF akan dihapus selamanya. Lanjutkan?')) {

router.delete(`/admin/works/${id}/force-delete`);

        }

    };


return (

        <div>

            <Headtitle="Kelola Karya" />

            <h1className="text-2xl font-bold">Kelola Karya</h1>


            <tableclassName="w-full">

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

                        <trkey={work.id}className={work.deleted_at?'bg-red-50':''}>

                            <td>

{work.title}

{work.deleted_at && <spanclassName="ml-2 text-xs text-red-600">(Dihapus)</span>}

                            </td>

                            <td>{work.author.name}</td>

                            <td>{work.status}</td>

                            <tdclassName="space-x-2">

{!work.deleted_at? (

                                    <>

{/* Soft delete */}

                                        <Canpermission="work.delete-own">

                                            <Buttonvariant="destructive"size="sm"onClick={() =>handleSoftDelete(work.id)}>

                                                <Trash2className="h-4 w-4" />

                                            </Button>

                                        </Can>

                                    </>

                                ) : (

                                    <>

{/* Restore */}

                                        <Canpermission="work.delete-own">

                                            <Buttonvariant="outline"size="sm"onClick={() =>handleRestore(work.id)}>

                                                <RotateCcwclassName="h-4 w-4" />

                                            </Button>

                                        </Can>


{/* Force delete */}

                                        <Canpermission="work.delete-own">

                                            <Buttonvariant="destructive"size="sm"onClick={() =>handleForceDelete(work.id)}>

                                                <AlertTriangleclassName="h-4 w-4" />

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

-**Format**: PDF ONLY (`application/pdf`)

-**Max size**: 50 MB per file

-**Storage**: Laravel Storage (local/S3-compatible)

-**Path**: `storage/app/works/` (NOT public directly)

-**Filename**: Auto-generated by system

-**Access**: Signed URL for download

### Validation

```php

$request->validate([

'full_file' => ['required','file','mimes:pdf','max:51200'],// 50MB in KB

'chapter_files.*' => ['required','file','mimes:pdf','max:51200'],

]);

```

### React Upload Component

```tsx

<FileUploaderaccept="application/pdf"maxSize={50*1024*1024}onUpload={handleUpload} />

```

---

## CRITICAL: Inertia Page Resolution

Pages di-resolve dengan kebab-case path:

```tsx

// resources/js/app.tsx

resolve: (name) =>resolvePageComponent(

`./pages/${name}.tsx`,        // ← kebab-case

import.meta.glob('./pages/**/*.tsx')

),

```

Contoh pemanggilan dari Laravel:

```php

// Controller

returnInertia::render('student/works/create');// kebab-case

returnInertia::render('admin/work-categories/index');

returnInertia::render('public-pages/work-detail');

```

---

## Database Schema Reference

### Key Tables

| Table | Purpose | SoftDelete |

| -------------------- | --------------------- | ------------------- |

| users | Auth users | ✅ |

| faculties | Fakultas | ✅ |

| departments | Program studi | ✅ |

| work_categories | Skripsi, KTI, Tesis | ✅ |

| works | Main works table | ✅ |

| work_chapters | Per-bab PDF files | ✅ |

| work_reviews | Review history | ✅ |

| activity_logs | System activity | ✅ |

| roles | Spatie roles | ❌ (Spatie default) |

| permissions | Spatie permissions | ❌ (Spatie default) |

| model_has_roles | User-role pivot | ❌ (Spatie default) |

| role_has_permissions | Role-permission pivot | ❌ (Spatie default) |

### Key Columns (works table)

-`status`: enum (draft|pending_review|in_review|revision|approved|published|rejected)

-`visibility`: enum (public|restricted), default: public

-`keywords`: JSON array

-`full_file_path`: varchar(500), nullable

-`full_file_size`: bigint, nullable

-`view_count`: bigint, default 0

-`download_count`: bigint, default 0

-`published_at`: timestamp, nullable

-`submitted_at`: timestamp, nullable

-`deleted_at`: timestamp, nullable ← SoftDeletes

---

## Coding Patterns

### Laravel Controller Pattern

```php

<?php


namespaceApp\Http\Controllers\Mahasiswa;


useApp\Http\Controllers\Controller;

useApp\Http\Requests\StoreWorkRequest;

useApp\Models\Work;

useIlluminate\Support\Facades\Auth;

useInertia\Inertia;


classWorkControllerextendsController

{

publicfunctionindex()

{

$works = Work::where('author_id',Auth::id())

            ->with('category','department')

            ->latest()

            ->paginate(10);


returnInertia::render('student/works/index', [

'works' => $works,

        ]);

}


publicfunctioncreate()

{

$this->authorize('create',Work::class);


returnInertia::render('student/works/create');

}


publicfunctionstore(StoreWorkRequest$request)

{

$validated = $request->validated();

// ... logic


returnredirect()->route('student.works.index')

            ->with('success','Karya berhasil disimpan sebagai draft.');

}

}

```

### React Page Pattern

```tsx

// resources/js/pages/student/works/index.tsx

import { Head, Link } from'@inertiajs/react';

import { usePermission } from'@/hooks/use-permission';

import { Can } from'@/components/permissions';

import { Button } from'@/components/ui/button';

importAppLayoutfrom'@/components/layouts/app-layout';


interfaceProps {

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


exportdefaultfunctionWorksIndex({ works }: Props) {

const { can } = usePermission();


return (

        <AppLayout>

            <Headtitle="Daftar Karya" />


            <divclassName="space-y-6">

                <divclassName="flex items-center justify-between">

                    <h1className="text-2xl font-bold">Daftar Karya Saya</h1>


                    <Canpermission="work.create">

                        <Linkhref="/student/works/create">

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

import { WorkStatus } from'@/lib/permissions';


exportinterfaceWork {

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


exportinterfaceWorkCategory {

id: number;

name: string;

slug: string;

description: string | null;

}

```

### Service Pattern (Laravel)

```php

<?php


namespaceApp\Services;


useApp\Models\Work;

useIlluminate\Http\UploadedFile;

useIlluminate\Support\Facades\Storage;


classWorkUploadService

{

publicfunctionstoreFullFile(Work$work,UploadedFile$file): string

{

$fileName = $this->generateFileName($file);

$path = $file->storeAs('works/'.$work->id,$fileName,'local');


return$path;

}


publicfunctionstoreChapterFile(Work$work,UploadedFile$file,int$chapterNumber): string

{

$fileName = "chapter-{$chapterNumber}-".$this->generateFileName($file);

$path = $file->storeAs('works/'.$work->id.'/chapters',$fileName,'local');


return$path;

}


privatefunctiongenerateFileName(UploadedFile$file): string

{

returnuniqid().'_'.time().'.'.$file->getClientOriginalExtension();

}


publicfunctiondeleteFile(string$path): bool

{

returnStorage::disk('local')->delete($path);

}

}

```

---

## Response Format Rules

### Laravel Success Response

```php

returnredirect()->back()->with('success','Pesan sukses');

returnredirect()->route('route.name')->with('success','Pesan sukses');

```

### Laravel Error Response

```php

returnredirect()->back()->with('error','Pesan error')->withInput();

```

### Flash Messages di Inertia

```tsx

// Akses flash messages

const { flash } = usePage<PageProps>().props;


// Tampilkan toast/alert

{

flash?.success && <Alerttype="success">{flash.success}</Alert>;

}

{

flash?.error && <Alerttype="error">{flash.error}</Alert>;

}

```

---

## Security Guidelines

1.**File Storage**: Selalu pakai `Storage::disk('local')`, jangan simpan di public

2.**Download**: Gunakan signed URL atau stream via controller

3.**Validation**: Server-side MIME type validation WAJIB

4.**CSRF**: Inertia handle otomatis, tapi tetap validasi

5.**Rate Limiting**: Apply di upload dan auth endpoints

6.**Authorization**: Selalu gunakan Policy/Gate, jangan cek role manual di controller

7.**Input Sanitization**: Sanitize semua user input

8.**Soft Delete**: Jangan expose soft deleted data ke public endpoint

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

-**Code**: English (variables, functions, classes)

-**UI Labels**: Indonesian (sesuai kebutuhan user)

-**Comments**: Indonesian atau English tapi konsisten

-**Database**: English (table names, column names)

-**Route names**: kebab-case English → `student.works.index`

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
