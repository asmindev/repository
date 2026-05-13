import { Button } from '@/components/ui/button';
import { Download, Eye, FileText } from 'lucide-react';

interface PdfViewerProps {
    workId: string | number;
    canDownload: boolean;
    title: string;
}

export function PdfViewer({ workId, canDownload, title }: PdfViewerProps) {
    const previewUrl = route('works.preview', workId);
    const downloadUrl = route('works.download', workId);

    const handlePreview = () => {
        window.open(previewUrl, '_blank');
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-base font-semibold text-foreground">Naskah Lengkap (Full Text)</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-md">
                            {title}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Preview Button - Open in new tab */}
                    <Button 
                        onClick={handlePreview}
                        variant="outline" 
                        className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
                    >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Baca</span>
                    </Button>

                    {/* Download Button */}
                    {canDownload && (
                        <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="gap-2 shadow-sm transition-all hover:scale-105 active:scale-95">
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Unduh</span>
                            </Button>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
