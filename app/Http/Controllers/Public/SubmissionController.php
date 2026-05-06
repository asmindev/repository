<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\User;
use App\Models\Work;
use App\Models\WorkCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function create()
    {
        return Inertia::render('public-pages/works/create', [
            'categories'  => WorkCategory::orderBy('name')->get(['id', 'name', 'has_supervisors']),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'supervisors' => User::role('lecturer')->orderBy('name')->get(['id', 'name', 'nidn']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id'      => ['required', 'exists:work_categories,id'],
            'department_id'    => ['required', 'exists:departments,id'],
            'author_name'      => ['required', 'string', 'max:255'],
            'author_nim'       => ['required', 'max:50'],
            'supervisor_ids'   => [
                function ($attribute, $value, $fail) use ($request) {
                    $category = \App\Models\WorkCategory::find($request->category_id);
                    if ($category && $category->has_supervisors) {
                        if (empty($value) || !is_array($value) || count($value) < 1) {
                            $fail('Dosen pembimbing wajib diisi untuk kategori ini.');
                        }
                    }
                },
                'nullable',
                'array',
            ],
            'supervisor_ids.*' => ['exists:users,id'],
            'title'            => ['required', 'string', 'max:500'],
            'abstract'         => ['required', 'string'],
            'keywords'         => ['required', 'string'],
            'year'             => ['required', 'integer', 'min:2000', 'max:' . (date('Y') + 1)],
            'language'         => ['required', 'in:id,en'],
            'full_file'        => [
                'required',
                'file',
                'mimes:' . implode(',', config('kti.files.allowed_mimes')),
                'max:' . config('kti.files.max_size')
            ],
            'cover_image'      => [
                'required',
                'image',
                'mimes:' . implode(',', config('kti.files.cover_allowed_mimes')),
                'max:' . config('kti.files.cover_max_size')
            ],
            
            // Validation for chapters array
            'chapters'                 => ['nullable', 'array'],
            'chapters.*.title'         => ['required_with:chapters', 'string', 'max:255'],
            'chapters.*.chapter_number'=> ['required_with:chapters', 'integer', 'min:1', 'max:20'],
            'chapters.*.description'   => ['nullable', 'string', 'max:500'],
            'chapters.*.file'          => [
                'required_with:chapters',
                'file',
                'mimes:' . implode(',', config('kti.files.allowed_mimes')),
                'max:' . config('kti.files.max_size')
            ],
        ]);

        $authorId = $this->getOrCreateStudent($validated['author_name'], $validated['author_nim']);

        // Handle full file upload
        $filePath = null;
        $fileSize = null;
        if ($request->hasFile('full_file')) {
            $file = $request->file('full_file');
            $filePath = $file->store('works', 'local');
            $fileSize = $file->getSize();
        }

        // Handle cover image upload
        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('works/covers', 'public');
        }

        // Parse keywords string into array
        $keywords = array_map('trim', explode(',', $validated['keywords']));
        $keywords = array_filter($keywords);

        $work = Work::create([
            'category_id'       => $validated['category_id'],
            'department_id'     => $validated['department_id'],
            'author_id'         => $authorId,
            'title'             => $validated['title'],
            'abstract'          => $validated['abstract'],
            'keywords'          => $keywords,
            'year'              => $validated['year'],
            'language'          => $validated['language'],
            'visibility'        => 'public', // Default visibility for public submission
            'cover_image_path'  => $coverPath,
            'full_file_path'    => $filePath,
            'full_file_size'    => $fileSize,
            'status'            => 'draft', // Forced status
        ]);

        // Sync Supervisors (Multiple)
        $work->supervisors()->sync($validated['supervisor_ids'] ?? []);

        // Process chapters if any
        if ($request->has('chapters') && is_array($request->chapters)) {
            foreach ($request->chapters as $index => $chapterData) {
                $file = $request->file("chapters.{$index}.file");
                
                if ($file) {
                    $chapterFilePath = $file->store("works/{$work->id}/chapters", 'local');
                    
                    $work->chapters()->create([
                        'title'          => $chapterData['title'],
                        'chapter_number' => $chapterData['chapter_number'],
                        'description'    => $chapterData['description'] ?? null,
                        'file_path'      => $chapterFilePath,
                        'file_size'      => $file->getSize(),
                    ]);
                }
            }
        }

        return redirect()->route('home')
            ->with('success', 'Karya berhasil disubmit dan menunggu verifikasi.');
    }

    /**
     * Get or create a student user by NIM.
     */
    private function getOrCreateStudent(string $name, string $nim): int
    {
        // Cari user mahasiswa yang sudah ada dengan NIM yang sama
        $user = User::role('student')->where('nim', $nim)->first();

        if (!$user) {
            // Jika tidak ada, buat baru
            $user = User::create([
                'name'      => $name,
                'email'     => strtolower(str_replace(' ', '.', $name)) . '.' . rand(100, 999) . '@student.mail',
                'password'  => bcrypt('password123'), // Default password
                'nim'       => $nim,
                'is_active' => true,
            ]);
            
            // Assign role student
            $user->assignRole('student');
        }

        return $user->id;
    }
}
