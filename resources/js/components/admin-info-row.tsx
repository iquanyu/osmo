import type { ReactNode } from 'react';

export function AdminInfoRow({
    label,
    value,
}: {
    label: string;
    value: ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0">
            <span className="text-muted-foreground">{label}</span>
            <div className="text-right">{value}</div>
        </div>
    );
}
