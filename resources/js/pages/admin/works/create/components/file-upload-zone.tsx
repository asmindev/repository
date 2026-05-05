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
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800">
                <FileUp className="h-4 w-4 text-orange-600" />
                File Karya (PDF)
            </h2>

            {!file ? (
                <label
                    htmlFor="full_file"
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition-colors hover:border-blue-400 hover:bg-blue-50"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">Klik untuk memilih file PDF</p>
                        <p className="mt-1 text-xs text-gray-400">Maksimal 50 MB · Hanya format PDF</p>
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
                <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
                            <FileUp className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {(internalError || error) && (
                <p className="mt-2 text-xs font-medium text-red-600">{internalError || error}</p>
            )}
        </div>
    );
}
