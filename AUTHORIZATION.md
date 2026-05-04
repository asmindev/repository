# KTI Authorization System Documentation

## Middleware

### 1. **Spatie Built-in Middleware** (Automatic)

Provided by `spatie/laravel-permission`:

```php
Route::middleware('role:admin')->group(function () {
    // Only users with 'admin' role
});

Route::middleware('permission:work.create')->group(function () {
    // Only users with 'work.create' permission
});
```

### 2. **Custom Middleware** (app/Http/Middleware/)

#### EnsureUserHasRole.php

Manually check if user has a role:

```php
// In route
Route::middleware('role:admin')->get('/admin', AdminController::class);

// This middleware checks hasRole('admin')
```

#### EnsureUserHasPermission.php

Manually check if user has a permission:

```php
// In route
Route::middleware('permission:work.review')->get('/review', ReviewController::class);

// This middleware checks can('work.review')
```

### 3. **HandleInertiaRequests Middleware**

Auto-shares user data with frontend:

```tsx
// In React component, all users get:
const { auth } = usePage<PageProps>().props;
// auth.user.roles: string[]
// auth.user.permissions: string[]
```

## Gates

Registered in `app/Providers/AuthorizationServiceProvider.php`

### Work-Related Gates

```php
Gate::define('create-work', fn(User $user) => $user->can('work.create'));
Gate::define('edit-own-draft-work', fn(User $user, Work $work) => ...);
Gate::define('delete-own-draft-work', fn(User $user, Work $work) => ...);
Gate::define('submit-work', fn(User $user, Work $work) => ...);
Gate::define('review-work', fn(User $user, Work $work) => ...);
Gate::define('approve-work', fn(User $user, Work $work) => ...);
Gate::define('reject-work', fn(User $user, Work $work) => ...);
Gate::define('request-revision', fn(User $user, Work $work) => ...);
Gate::define('publish-work', fn(User $user, Work $work) => ...);
Gate::define('view-work', fn(User $user, Work $work) => ...);
Gate::define('view-works', fn(User $user) => ...);
```

### User-Related Gates

```php
Gate::define('manage-users', fn(User $user) => $user->can('user.view-any'));
Gate::define('create-user', fn(User $user) => $user->can('user.create'));
Gate::define('edit-user', fn(User $user, User $target) => ...);
Gate::define('delete-user', fn(User $user, User $target) => ...);
```

### Role-Related Gates

```php
Gate::define('is-admin', fn(User $user) => $user->hasRole('admin'));
Gate::define('is-lecturer', fn(User $user) => $user->hasRole('dosen'));
Gate::define('is-student', fn(User $user) => $user->hasRole('mahasiswa'));
```

## Usage Examples

### In Controllers

```php
// Check permission
if ($request->user()->can('work.create')) {
    // Allow
}

// Check role
if ($request->user()->hasRole('admin')) {
    // Allow
}

// Use gates
$this->authorize('create-work'); // Throws 403 if false

// Pass model to gate
$this->authorize('edit-own-draft-work', $work);

// Multiple checks
if (Gate::allows('edit-user', $targetUser)) {
    // Allow
}
```

### In Routes

```php
// Using Spatie middleware
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', AdminController::class);
});

Route::middleware(['auth', 'permission:work.review'])->group(function () {
    Route::get('/review', ReviewController::class);
});
```

### In Views/React

```tsx
import { usePage } from '@inertiajs/react';
import { Can } from '@/components/permissions';

export default function MyComponent() {
    const { auth } = usePage();

    // Check permission via component
    return (
        <Can permission="work.create">
            <Button>Create Work</Button>
        </Can>
    );
}
```

## Policies

Defined in `app/Http/Policies/`

### WorkPolicy.php

```php
public function view(User $user, Work $work): bool
public function create(User $user): bool
public function update(User $user, Work $work): bool
public function delete(User $user, Work $work): bool
public function restore(User $user, Work $work): bool
public function forceDelete(User $user, Work $work): bool
public function submit(User $user, Work $work): bool
public function review(User $user, Work $work): bool
public function approve(User $user, Work $work): bool
public function reject(User $user, Work $work): bool
public function publish(User $user, Work $work): bool
```

### UserPolicy.php

```php
public function view(User $user, User $targetUser): bool
public function create(User $user): bool
public function update(User $user, User $targetUser): bool
public function delete(User $user, User $targetUser): bool
```

## Authorization Hierarchy

```
1. Middleware Check (role/permission)
   ↓ (if passed)
2. Policy/Gate Check (specific logic)
   ↓ (if passed)
3. Action Executed
```

## Role Permissions Matrix

| Permission           | Admin | Dosen | Mahasiswa |
| -------------------- | ----- | ----- | --------- |
| user.view-any        | ✅    | ❌    | ❌        |
| user.create          | ✅    | ❌    | ❌        |
| user.update          | ✅    | ❌    | ❌        |
| user.delete          | ✅    | ❌    | ❌        |
| work.view-any        | ✅    | ✅    | ❌        |
| work.view-own        | ✅    | ✅    | ✅        |
| work.create          | ✅    | ❌    | ✅        |
| work.update-own      | ✅    | ❌    | ✅        |
| work.delete-own      | ✅    | ❌    | ✅        |
| work.submit          | ✅    | ❌    | ✅        |
| work.review          | ✅    | ✅    | ❌        |
| work.approve         | ✅    | ✅    | ❌        |
| work.reject          | ✅    | ✅    | ❌        |
| work.publish         | ✅    | ❌    | ❌        |
| work.assign-reviewer | ✅    | ❌    | ❌        |
| report.export        | ✅    | ❌    | ❌        |
| setting.manage       | ✅    | ❌    | ❌        |

## Testing Authorization

```bash
# Test as specific user
$user = User::whereHas('roles', fn($q) => $q->where('name', 'mahasiswa'))->first();
$this->actingAs($user);

# Test gate
$this->assertTrue(Gate::allows('create-work'));

# Test policy
$this->assertTrue($user->can('create', Work::class));
```
