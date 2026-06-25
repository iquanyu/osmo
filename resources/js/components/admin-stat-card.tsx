import type { ReactNode } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Props {
    title: string;
    value: number;
    note?: string;
    icon?: ReactNode;
    className?: string;
    active?: boolean;
    onClick?: () => void;
}

export function AdminStatCard({
    title,
    value,
    note,
    icon,
    className,
    active = false,
    onClick,
}: Props) {
    const content = (
        <Card
            className={`border-sidebar-border/70 dark:border-sidebar-border ${
                active ? 'border-red-500/30' : ''
            } ${onClick && !active ? 'hover:border-red-500/20' : ''} ${
                className ?? ''
            }`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {note ? (
                    <p className="text-xs text-muted-foreground">{note}</p>
                ) : null}
            </CardContent>
        </Card>
    );

    if (!onClick) {
        return content;
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`text-left transition-colors ${
                active ? 'rounded-xl ring-2 ring-red-500/40' : ''
            }`}
        >
            {content}
        </button>
    );
}
