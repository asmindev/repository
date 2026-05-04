<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'faculty_id',
        'name',
        'slug',
        'description',
    ];

    // ─── Relationships ──────────────────────────────────

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function works()
    {
        return $this->hasMany(Work::class);
    }
}
