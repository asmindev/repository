<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\FacultyController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WorkCategoryController;
use App\Http\Controllers\Admin\WorkChapterController;
use App\Http\Controllers\Admin\WorkController as AdminWorkController;
use App\Http\Controllers\Lecturer\DashboardController as LecturerDashboardController;
use App\Http\Controllers\Lecturer\ReviewController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\SearchController;
use App\Http\Controllers\Public\WorkController as PublicWorkController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\WorkController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\SubmissionController;

// ─── Public Routes ──────────────────────────────────────────

Route::get('/', HomeController::class)->name('home');
Route::get('/search', SearchController::class)->name('search');
Route::get('/submit-work', [SubmissionController::class, 'create'])->name('works.submit.create');
Route::post('/submit-work', [SubmissionController::class, 'store'])->name('works.submit.store');
Route::get('/works/{work}', [PublicWorkController::class, 'show'])->name('works.show');
Route::get('/works/{work}/download', [PublicWorkController::class, 'download'])->name('works.download');
Route::get('/works/{work}/chapters/{chapter}/download', [PublicWorkController::class, 'downloadChapter'])->name('works.chapters.download');

// ─── Auth Routes ────────────────────────────────────────────

Route::middleware('guest')->group(function () {
    // Login views are handled by Fortify
});

Route::middleware(['auth', 'verified'])->group(function () {
    // ─── Student Routes ─────────────────────────────────────

    Route::middleware('role:student|admin')->prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', StudentDashboardController::class)->name('dashboard');

        Route::resource('works', WorkController::class);
        Route::post('/works/{work}/submit', [WorkController::class, 'submit'])->name('works.submit');
    });

    // ─── Lecturer Routes ────────────────────────────────────

    Route::middleware('role:lecturer|admin')->prefix('lecturer')->name('lecturer.')->group(function () {
        Route::get('/dashboard', LecturerDashboardController::class)->name('dashboard');

        Route::get('/reviews/pending', [ReviewController::class, 'pending'])->name('reviews.pending');
        Route::get('/reviews/{work}', [ReviewController::class, 'show'])->name('reviews.show');
        Route::post('/reviews/{work}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
        Route::post('/reviews/{work}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
        Route::post('/reviews/{work}/revision', [ReviewController::class, 'requestRevision'])->name('reviews.revision');
        Route::get('/reviews/history', [ReviewController::class, 'history'])->name('reviews.history');

        // Preview/edit own work
        Route::get('/works/{work}/preview', [PublicWorkController::class, 'preview'])->name('works.preview');
    });

    // ─── Admin Routes ───────────────────────────────────────

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', AdminDashboardController::class)->name('dashboard');

        // User Management
        Route::resource('users', UserController::class);

        // Work Management
        Route::get('/works', [AdminWorkController::class, 'index'])->name('works.index');
        Route::get('/works/trashed', [AdminWorkController::class, 'trashed'])->name('works.trashed');
        Route::get('/works/create', [AdminWorkController::class, 'create'])->name('works.create');
        Route::post('/works', [AdminWorkController::class, 'store'])->name('works.store');
        Route::get('/works/{work}', [AdminWorkController::class, 'show'])->name('works.show');
        Route::get('/works/{work}/edit', [AdminWorkController::class, 'edit'])->name('works.edit');
        Route::post('/works/{work}/publish', [AdminWorkController::class, 'publish'])->name('works.publish');
        Route::patch('/works/{work}/status', [AdminWorkController::class, 'changeStatus'])->name('works.change-status');
        Route::post('/works/{work}', [AdminWorkController::class, 'update'])->name('works.update'); // Use POST with _method PUT in frontend
        Route::delete('/works/{work}', [AdminWorkController::class, 'destroy'])->name('works.destroy');
        Route::post('/works/{id}/restore', [AdminWorkController::class, 'restore'])->name('works.restore');
        Route::delete('/works/{id}/force-delete', [AdminWorkController::class, 'forceDelete'])->name('works.force-delete');

        // Work Chapters Management
        Route::get('/works/{work}/chapters', [WorkChapterController::class, 'index'])->name('works.chapters.index');
        Route::post('/works/{work}/chapters', [WorkChapterController::class, 'store'])->name('works.chapters.store');
        Route::post('/works/{work}/chapters/{chapter}', [WorkChapterController::class, 'update'])->name('works.chapters.update');
        Route::delete('/works/{work}/chapters/{chapter}', [WorkChapterController::class, 'destroy'])->name('works.chapters.destroy');

        // Department Management
        Route::resource('departments', DepartmentController::class);

        // Faculty Management
        Route::post('/faculties', [FacultyController::class, 'store'])->name('faculties.store');

        // Work Category Management
        Route::resource('work-categories', WorkCategoryController::class);

        // Reports
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/', [ReportController::class, 'index'])->name('index');
            Route::get('/works', [ReportController::class, 'works'])->name('works');
            Route::get('/users', [ReportController::class, 'users'])->name('users');
            Route::post('/export', [ReportController::class, 'export'])->name('export');
        });
    });

    // ─── Universal Routes (All authenticated) ──────────────

    // View own work preview
    Route::get('/works/{work}/preview', [PublicWorkController::class, 'preview'])->name('works.preview');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
});
