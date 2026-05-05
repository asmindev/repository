import { useRef, useState } from 'react';
import { FileUp, Upload, X } from 'lucide-react';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../utils/constants';

interface FileUploadZoneProps {
    file: File | null;
    onChange: (file: File | null) => void;
    error?: string;
}

export function FileUploadZone({ file, onChange, error }: FileUploadZoneProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [internalError, setInternalError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setInternalError(null);

        if (!selectedFile) {
            onChange(null);
            return;
        }

        if (!ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
            setInternalError('Hanya file PDF yang diperbolehkan.');
            e.target.value = '';
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setInternalError('Ukuran file maksimal 50 MB.');
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
                File Karya (PDF)
            </h2>

            {!file ? (
                <label
                    htmlFor="full_file"
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-10 transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground/70">Klik untuk memilih file PDF</p>
                        <p className="mt-1 text-xs text-muted-foreground/60">Maksimal 50 MB · Hanya format PDF</p>
                    </div>
                    <input
                        ref={fileInputRef}
                        id="full_file"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                            <FileUp className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground/80">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(file.size / (1024 * 1024)).toFixed(1)} MB
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

            {(internalError || error) && (
                <p className="mt-2 text-xs font-medium text-destructive">{internalError || error}</p>
            )}
        </div>
    );
}
