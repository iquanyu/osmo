import type { ReactNode } from 'react';

export function AdminInfoTile({
    label,
    value,
}: {
    label: string;
    value: ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-background p-3">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 text-sm font-medium">{value}</div>
        </div>
    );
}
