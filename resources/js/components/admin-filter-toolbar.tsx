import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export function AdminFilterToolbar({
    filters,
    quickFilters,
    onReset,
    onApply,
}: {
    filters: ReactNode;
    quickFilters?: ReactNode;
    onReset: () => void;
    onApply: () => void;
}) {
    return (
        <div className="space-y-3">
            <div className="rounded-xl border border-sidebar-border/70 bg-muted/20 p-3 dark:border-sidebar-border">
                <div className="grid grid-cols-1 gap-3">{filters}</div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
                {quickFilters ? (
                    <div className="mr-auto flex flex-wrap gap-2">
                        {quickFilters}
                    </div>
                ) : null}
                <Button variant="outline" size="sm" onClick={onReset}>
                    重置筛选
                </Button>
                <Button size="sm" onClick={onApply}>
                    应用筛选
                </Button>
            </div>
        </div>
    );
}
