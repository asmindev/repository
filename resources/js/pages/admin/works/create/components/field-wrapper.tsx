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
            <Label htmlFor={id} className="text-sm font-medium text-foreground/80">
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            {children}
            {hint && !error && <p className="text-[11px] text-muted-foreground/60">{hint}</p>}
            {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
        </div>
    );
}
