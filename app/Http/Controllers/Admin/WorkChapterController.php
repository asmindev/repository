<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Work;
use App\Models\WorkChapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WorkChapterController extends Controller
{
    /**
     * Display chapters for a work.
     */
    public function index(Work $work)
    {
        $this->authorize('view', $work);

        return Inertia::render('admin/works/chapters/index', [
            'work' => $work->load('author', 'category'),
            'chapters' => $work->chapters()
                ->orderBy('chapter_number')
                ->get(),
        ]);
    }

    /**
     * Store a new chapter.
     */
    public function store(Request $request, Work $work)
    {
        $this->authorize('update', $work);

        $validated = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'chapter_number' => ['required', 'integer', 'min:1', 'max:20'],
            'description'    => ['nullable', 'string', 'max:500'],
            'file'           => ['required', 'file', 'mimes:pdf', 'max:51200'], // 50MB
        ]);

        // Check duplicate chapter number
        $exists = $work->chapters()
            ->where('chapter_number', $validated['chapter_number'])
            ->exists();

        if ($exists) {
            return redirect()->back()
                ->withErrors(['chapter_number' => 'Nomor bab sudah digunakan untuk karya ini.']);
        }

        $file = $request->file('file');
        $filePath = $file->store("works/{$work->id}/chapters", 'local');

        $work->chapters()->create([
            'title'          => $validated['title'],
            'chapter_number' => $validated['chapter_number'],
            'description'    => $validated['description'] ?? null,
            'file_path'      => $filePath,
            'file_size'      => $file->getSize(),
        ]);

        return redirect()->back()
            ->with('success', "Bab {$validated['chapter_number']} berhasil diupload.");
    }

    /**
     * Update chapter metadata (title/description). Re-upload file optional.
     */
    public function update(Request $request, Work $work, WorkChapter $chapter)
    {
        $this->authorize('update', $work);

        $validated = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'chapter_number' => ['required', 'integer', 'min:1', 'max:20'],
            'description'    => ['nullable', 'string', 'max:500'],
            'file'           => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
        ]);

        // Check duplicate chapter number (exclude current)
        $exists = $work->chapters()
            ->where('chapter_number', $validated['chapter_number'])
            ->where('id', '!=', $chapter->id)
            ->exists();

        if ($exists) {
            return redirect()->back()
                ->withErrors(['chapter_number' => 'Nomor bab sudah digunakan untuk karya ini.']);
        }

        $updateData = [
            'title'          => $validated['title'],
            'chapter_number' => $validated['chapter_number'],
            'description'    => $validated['description'] ?? null,
        ];

        // Replace file if new one uploaded
        if ($request->hasFile('file')) {
            // Delete old file
            if ($chapter->file_path) {
                Storage::disk('local')->delete($chapter->file_path);
            }

            $file = $request->file('file');
            $updateData['file_path'] = $file->store("works/{$work->id}/chapters", 'local');
            $updateData['file_size'] = $file->getSize();
        }

        $chapter->update($updateData);

        return redirect()->back()
            ->with('success', "Bab {$validated['chapter_number']} berhasil diperbarui.");
    }

    /**
     * Soft delete a chapter.
     */
    public function destroy(Work $work, WorkChapter $chapter)
    {
        $this->authorize('update', $work);

        // Delete file from storage
        if ($chapter->file_path) {
            Storage::disk('local')->delete($chapter->file_path);
        }

        $chapter->delete();

        return redirect()->back()
            ->with('success', 'Bab berhasil dihapus.');
    }
}
