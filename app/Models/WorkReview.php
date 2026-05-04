<?php

namespace App\Models;

use App\Enums\ReviewAction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkReview extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'work_reviews';

    protected $fillable = [
        'work_id',
        'reviewer_id',
        'action',
        'comment',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
        'action' => ReviewAction::class,
    ];

    // ─── Relationships ──────────────────────────────────

    public function work()
    {
        return $this->belongsTo(Work::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
