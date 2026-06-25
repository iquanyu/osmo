import type { ReactNode } from 'react';

export function AdminListCard({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={
                className ??
                'overflow-hidden rounded-xl border border-sidebar-border/70 transition-colors hover:bg-muted/40 dark:border-sidebar-border'
            }
        >
            {children}
        </div>
    );
}

export function AdminListCardHeader({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={
                className ??
                'flex flex-col justify-between gap-3 border-b border-border bg-muted/50 px-4 py-3 sm:flex-row sm:items-center'
            }
        >
            {children}
        </div>
    );
}

export function AdminListCardBody({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={className ?? 'space-y-2 p-4'}>{children}</div>;
}

export function AdminListCardFooter({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={className ?? 'flex items-center gap-3 text-xs text-muted-foreground'}>
            {children}
        </div>
    );
}
