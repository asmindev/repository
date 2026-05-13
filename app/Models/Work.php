<?php

namespace App\Models;

use App\Enums\WorkStatus;
use App\Enums\WorkVisibility;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Work extends Model
{
    use HasFactory, SoftDeletes;

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
        'cover_image_path',
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
        'view_count' => 'integer',
        'download_count' => 'integer',
        'status' => WorkStatus::class,
        'visibility' => WorkVisibility::class,
    ];

    // ─── Relationships ──────────────────────────────────

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function supervisors()
    {
        return $this->belongsToMany(User::class, 'work_supervisor', 'work_id', 'user_id')->withTimestamps();
    }

    public function category()
    {
        return $this->belongsTo(WorkCategory::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function chapters()
    {
        return $this->hasMany(WorkChapter::class);
    }

    public function reviews()
    {
        return $this->hasMany(WorkReview::class);
    }

    // ─── Accessors ──────────────────────────────────────

    public function getCanDownloadAttribute(): bool
    {
        return $this->category ? $this->category->can_download : false;
    }
}
