import type { ReactNode } from 'react';

export function AdminListPrimary({
    title,
    description,
    titleClassName,
    descriptionClassName,
    meta,
}: {
    title: ReactNode;
    description?: ReactNode;
    titleClassName?: string;
    descriptionClassName?: string;
    meta?: ReactNode;
}) {
    return (
        <div className="min-w-0">
            <div className={titleClassName ?? 'truncate text-sm font-semibold'}>
                {title}
            </div>
            {description ? (
                <div
                    className={
                        descriptionClassName ??
                        'mt-1 line-clamp-2 text-xs text-muted-foreground'
                    }
                >
                    {description}
                </div>
            ) : null}
            {meta ? <div className="mt-1">{meta}</div> : null}
        </div>
    );
}
