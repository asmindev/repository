<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FacultyController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:faculties,name',
            'slug' => 'required|string|max:255|unique:faculties,slug',
            'description' => 'nullable|string',
        ]);

        Faculty::create($validated);

        return redirect()->back()->with('success', 'Fakultas berhasil ditambahkan.');
    }

    public function update(Request $request, Faculty $faculty)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:faculties,name,' . $faculty->id,
            'slug' => 'required|string|max:255|unique:faculties,slug,' . $faculty->id,
            'description' => 'nullable|string',
        ]);

        $faculty->update($validated);

        return redirect()->back()->with('success', 'Fakultas berhasil diperbarui.');
    }

    public function destroy(Faculty $faculty)
    {
        $faculty->delete();

        return redirect()->back()->with('success', 'Fakultas berhasil dihapus.');
    }
}
