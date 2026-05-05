// File: resources/js/components/ui/pagination-nav.tsx

import { Link } from '@inertiajs/react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

export interface PaginationLinkType {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationNavProps {
    links: PaginationLinkType[];
    from?: number | null;
    to?: number | null;
    total?: number;
}

export function PaginationNav({ links, from, to, total }: PaginationNavProps) {
    if (!links || links.length <= 3) return null; // Only prev, 1, next (means 1 page)

    return (
        <div className="flex flex-col items-center justify-between gap-4 border-t bg-muted/30 px-4 py-3 sm:flex-row transition-colors">
            {(total !== undefined) && (
                <p className="text-xs text-muted-foreground">
                    {from && to
                        ? `Menampilkan ${from}–${to} dari ${total} entri`
                        : `Total ${total} entri`}
                </p>
            )}

            <Pagination className="mx-0 w-auto">
                <PaginationContent className="flex-wrap gap-1">
                    {links.map((link, index) => {
                        const isPrevious = link.label.includes('Previous');
                        const isNext = link.label.includes('Next');
                        const isEllipsis = link.label === '...';

                        // Disable links without URLs (e.g. Previous when on page 1)
                        if (!link.url) {
                            if (isPrevious) {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationPrevious href="#" className="pointer-events-none opacity-40 cursor-not-allowed" />
                                    </PaginationItem>
                                );
                            }
                            if (isNext) {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationNext href="#" className="pointer-events-none opacity-40 cursor-not-allowed" />
                                    </PaginationItem>
                                );
                            }
                            if (isEllipsis) {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationEllipsis className="text-muted-foreground/50" />
                                    </PaginationItem>
                                );
                            }
                            return null;
                        }

                        // For Inertia.js navigation, we should ideally use <Link> 
                        // The PaginationLink component uses asChild, so we can wrap Inertia's Link
                        const Comp = (props: any) => <Link {...props} href={link.url!} />;

                        if (isPrevious) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationPrevious asChild>
                                        <Comp />
                                    </PaginationPrevious>
                                </PaginationItem>
                            );
                        }

                        if (isNext) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationNext asChild>
                                        <Comp />
                                    </PaginationNext>
                                </PaginationItem>
                            );
                        }

                        // Normal page number
                        return (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    asChild
                                    isActive={link.active}
                                >
                                    <Link 
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                </PaginationContent>
            </Pagination>
        </div>
    );
}
