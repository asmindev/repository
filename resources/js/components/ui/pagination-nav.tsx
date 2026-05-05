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
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row">
            {(total !== undefined) && (
                <p className="text-xs text-gray-500">
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
                                        <PaginationPrevious href="#" className="pointer-events-none opacity-50" />
                                    </PaginationItem>
                                );
                            }
                            if (isNext) {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationNext href="#" className="pointer-events-none opacity-50" />
                                    </PaginationItem>
                                );
                            }
                            if (isEllipsis) {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }
                            return null;
                        }

                        if (isPrevious) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationPrevious href={link.url} />
                                </PaginationItem>
                            );
                        }

                        if (isNext) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationNext href={link.url} />
                                </PaginationItem>
                            );
                        }

                        // Normal page number
                        return (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    href={link.url}
                                    isActive={link.active}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </PaginationItem>
                        );
                    })}
                </PaginationContent>
            </Pagination>
        </div>
    );
}
