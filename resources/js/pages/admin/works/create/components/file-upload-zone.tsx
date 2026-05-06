import { Button } from '@/components/ui/button';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { FileUp, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface FileUploadZoneProps {
    file: File | null;
    existingUrl?: string;
    onChange: (file: File | null) => void;
    error?: string;
    required?: boolean;
}

export function FileUploadZone({ file, existingUrl, onChange, error, required }: FileUploadZoneProps) {
    const { config } = usePage<PageProps>().props;
    const { max_size, allowed_mime_types, allowed_mimes } = config.kti.files;

    // max_size in config is KB, convert to bytes for comparison
    const MAX_SIZE_BYTES = max_size * 1024;
    const MAX_SIZE_MB = (max_size / 1024).toFixed(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [internalError, setInternalError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setInternalError(null);

        if (!selectedFile) {
            onChange(null);
            return;
        }

        if (!allowed_mime_types.includes(selectedFile.type)) {
            setInternalError(`Hanya file ${allowed_mimes.join(', ').toUpperCase()} yang diperbolehkan.`);
            e.target.value = '';
            return;
        }

        if (selectedFile.size > MAX_SIZE_BYTES) {
            setInternalError(`Ukuran file maksimal ${MAX_SIZE_MB} MB.`);
            e.target.value = '';
            return;
        }

        onChange(selectedFile);
    };

    const removeFile = () => {
        onChange(null);
        setInternalError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground/80">
                <FileUp className="h-4 w-4 text-primary" />
                File Dokumen (PDF) {required && <span className="text-destructive">*</span>}
            </h2>

            {!file && !existingUrl ? (
                <label
                    htmlFor="full_file"
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-10 transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground/70">Klik untuk memilih file {allowed_mimes.join(', ').toUpperCase()}</p>
                        <p className="mt-1 text-xs text-muted-foreground/60">
                            Maksimal {MAX_SIZE_MB} MB · Format: {allowed_mimes.join(', ').toUpperCase()}
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        id="full_file"
                        type="file"
                        accept={allowed_mime_types.join(',')}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                            <FileUp className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground/80">{file ? file.name : 'File Terunggah'}</p>
                            <p className="text-xs text-muted-foreground">
                                {file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : 'Sudah ada di server'}
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeFile}
                        className="h-8 w-8 rounded-full text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Hapus</span>
                    </Button>
                </div>
            )}

            {(internalError || error) && <p className="mt-2 text-xs font-medium text-destructive">{internalError || error}</p>}
        </div>
    );
}
