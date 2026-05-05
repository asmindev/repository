import { useRef, useState } from 'react';
import { ImageIcon, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CoverImageUploadProps {
    file: File | null;
    onChange: (file: File | null) => void;
    error?: string;
}

export function CoverImageUpload({ file, onChange, error }: CoverImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [internalError, setInternalError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setInternalError(null);

        if (!selectedFile) {
            onChange(null);
            setPreviewUrl(null);
            return;
        }

        if (!selectedFile.type.startsWith('image/')) {
            setInternalError('Hanya file gambar (JPG, PNG) yang diperbolehkan.');
            e.target.value = '';
            return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
            setInternalError('Ukuran file maksimal 2 MB.');
            e.target.value = '';
            return;
        }

        onChange(selectedFile);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    const removeFile = () => {
        onChange(null);
        setPreviewUrl(null);
        setInternalError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground/80">
                <ImageIcon className="h-4 w-4 text-primary" />
                Gambar Sampul (Optional)
            </h2>

            {!previewUrl ? (
                <label
                    htmlFor="cover_image"
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-8 transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground/70">Klik untuk unggah sampul</p>
                        <p className="mt-1 text-xs text-muted-foreground/60">Maksimal 2 MB · JPG, PNG</p>
                    </div>
                    <input
                        ref={fileInputRef}
                        id="cover_image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="relative group overflow-hidden rounded-lg border border-border bg-muted/30">
                    <img 
                        src={previewUrl} 
                        alt="Cover Preview" 
                        className="h-48 w-full object-contain bg-black/5"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeFile}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Hapus Gambar
                        </Button>
                    </div>
                </div>
            )}

            {(internalError || error) && (
                <p className="mt-2 text-xs font-medium text-destructive">{internalError || error}</p>
            )}
        </div>
    );
}
