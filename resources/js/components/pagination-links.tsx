import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PaginatedData } from '@/types';

type Props = {
    pagination: Pick<PaginatedData<unknown>, 'from' | 'to' | 'total' | 'links'>;
    className?: string;
};

export function PaginationLinks({ pagination, className }: Props) {
    if (pagination.links.length <= 3) {
        return null;
    }

    return (
        <div
            className={cn(
                'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
                className,
            )}
        >
            <p className="text-xs text-muted-foreground">
                显示 {pagination.from ?? 0} - {pagination.to ?? 0} /{' '}
                {pagination.total}
            </p>
            <div className="flex flex-wrap items-center gap-2">
                {pagination.links.map((link, index) => (
                    <Button
                        key={`${link.label}-${index}`}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        asChild={link.url !== null}
                        disabled={link.url === null}
                    >
                        {link.url ? (
                            <Link
                                href={link.url}
                                preserveScroll
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
}
