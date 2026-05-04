<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkChapter extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'work_chapters';

    protected $fillable = [
        'work_id',
        'title',
        'chapter_number',
        'description',
        'file_path',
        'file_size',
    ];

    protected $casts = [
        'chapter_number' => 'integer',
        'file_size' => 'integer',
    ];

    // ─── Relationships ──────────────────────────────────

    public function work()
    {
        return $this->belongsTo(Work::class);
    }
}
