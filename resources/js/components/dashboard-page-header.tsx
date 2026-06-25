import type { LucideIcon } from 'lucide-react';

export function DashboardPageHeader({
    title,
    description,
    eyebrow,
    icon: Icon,
    actions,
}: {
    title: string;
    description: string;
    eyebrow: string;
    icon: LucideIcon;
    actions?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4 border-b border-sidebar-border/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shadow-red-600/20">
                    <Icon className="size-5" />
                </div>
                <div>
                    <p className="text-xs font-semibold tracking-widest text-red-600 uppercase dark:text-red-400">
                        {eyebrow}
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
        </div>
    );
}
