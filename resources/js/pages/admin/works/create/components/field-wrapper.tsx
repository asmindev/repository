import { Label } from '@/components/ui/label';

interface FieldWrapperProps {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
}

export function FieldWrapper({
    id,
    label,
    error,
    required,
    hint,
    children,
}: FieldWrapperProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </Label>
            {children}
            {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>
    );
}
