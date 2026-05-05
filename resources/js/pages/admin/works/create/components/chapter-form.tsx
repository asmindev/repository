import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { BookOpen, FileText, Plus, Trash2 } from 'lucide-react';
import { Chapter } from '../types';

interface ChapterFormProps {
    chapters: Chapter[];
    onAdd: () => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, field: string, value: any) => void;
    errors: any;
}

export function ChapterForm({ chapters, onAdd, onRemove, onUpdate, errors }: ChapterFormProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Daftar Bab & File Terpisah</h2>
                            <p className="text-xs text-gray-500">Opsional: Unggah file per bab (misal: BAB I, BAB II, dst)</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={onAdd}
                        size="sm"
                        className="gap-1.5 bg-blue-600 shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                    >
                        <Plus className="h-4 w-4" /> Tambah Bab
                    </Button>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                {chapters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-100 py-12 text-center transition-colors hover:border-gray-200">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                            <BookOpen className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Belum ada bab yang ditambahkan</p>
                        <p className="mt-1 text-xs text-gray-400">Klik tombol di pojok kanan atas untuk menambah bab</p>
                    </div>
                ) : (
                    <div className="relative space-y-8 before:absolute before:left-[17px] before:top-4 before:h-[calc(100%-16px)] before:w-0.5 before:bg-gray-100">
                        {chapters.map((chapter, index) => (
                            <div key={chapter.id} className="relative pl-10 animate-in fade-in slide-in-from-left-4 duration-300">
                                {/* Timeline Indicator */}
                                <div className="absolute left-0 top-0 flex h-[36px] w-[36px] items-center justify-center rounded-full border-4 border-white bg-blue-50 text-xs font-bold text-blue-600 ring-1 ring-blue-200 z-10">
                                    {index + 1}
                                </div>

                                <div className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-md">
                                    {/* Action Button */}
                                    <button
                                        type="button"
                                        onClick={() => onRemove(chapter.id)}
                                        className="absolute -right-2 -top-2 hidden h-8 w-8 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500 shadow-sm transition-all hover:bg-red-500 hover:text-white group-hover:flex"
                                        title="Hapus Bab"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>

                                    <div className="grid gap-5 sm:grid-cols-4">
                                        <div className="space-y-1.5 sm:col-span-1">
                                            <Label className="text-[11px] uppercase tracking-wider text-gray-500">
                                                No. Bab <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={chapter.chapter_number}
                                                onChange={(e) => onUpdate(chapter.id, 'chapter_number', e.target.value)}
                                                placeholder="1"
                                                className={cn("bg-gray-50/50 focus:bg-white", errors[`chapters.${index}.chapter_number`] && "border-red-400 focus:ring-red-100")}
                                            />
                                            {errors[`chapters.${index}.chapter_number`] && (
                                                <p className="text-[10px] font-medium text-red-600">
                                                    {errors[`chapters.${index}.chapter_number`]}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5 sm:col-span-3">
                                            <Label className="text-[11px] uppercase tracking-wider text-gray-500">
                                                Judul Bab <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                value={chapter.title}
                                                onChange={(e) => onUpdate(chapter.id, 'title', e.target.value)}
                                                placeholder="Contoh: PENDAHULUAN"
                                                className={cn("bg-gray-50/50 focus:bg-white", errors[`chapters.${index}.title`] && "border-red-400 focus:ring-red-100")}
                                            />
                                            {errors[`chapters.${index}.title`] && (
                                                <p className="text-[10px] font-medium text-red-600">{errors[`chapters.${index}.title`]}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] uppercase tracking-wider text-gray-500">Deskripsi (Opsional)</Label>
                                            <Textarea
                                                rows={2}
                                                value={chapter.description}
                                                onChange={(e) => onUpdate(chapter.id, 'description', e.target.value)}
                                                placeholder="Keterangan singkat tentang isi bab..."
                                                className="bg-gray-50/50 focus:bg-white"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] uppercase tracking-wider text-gray-500">
                                                File PDF Bab <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative group/file">
                                                <Input
                                                    type="file"
                                                    accept="application/pdf"
                                                    className={cn(
                                                        "cursor-pointer bg-gray-50/50 pr-10 file:h-10 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-blue-600 hover:bg-white",
                                                        errors[`chapters.${index}.file`] && "border-red-400 focus:ring-red-100"
                                                    )}
                                                    onChange={(e) => onUpdate(chapter.id, 'file', e.target.files?.[0] || null)}
                                                />
                                                <div className="absolute right-3 top-2.5 text-gray-400 group-hover/file:text-blue-500">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between px-1">
                                                <p className="text-[10px] text-gray-400">PDF Maks. 50 MB</p>
                                                {chapter.file && (
                                                    <p className="text-[10px] font-medium text-emerald-600 truncate max-w-[150px]">
                                                        {(chapter.file.size / (1024 * 1024)).toFixed(1)} MB terpilih
                                                    </p>
                                                )}
                                            </div>
                                            {errors[`chapters.${index}.file`] && (
                                                <p className="text-[10px] font-medium text-red-600">{errors[`chapters.${index}.file`]}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
