<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'work_categories';

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    // ─── Relationships ──────────────────────────────────

    public function works()
    {
        return $this->hasMany(Work::class, 'category_id');
    }
}
