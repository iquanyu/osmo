import type { LucideIcon } from 'lucide-react';

export function AdminEmptyState({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 py-16 text-center text-muted-foreground dark:border-sidebar-border">
            <Icon className="mb-3 h-10 w-10 opacity-40" />
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="mt-1 text-xs">{description}</p>
        </div>
    );
}
