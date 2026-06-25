import type { ReactNode } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function AdminDetailSection({
    title,
    description,
    children,
    contentClassName,
}: {
    title: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    contentClassName?: string;
}) {
    return (
        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                {description ? (
                    <CardDescription>{description}</CardDescription>
                ) : null}
            </CardHeader>
            <CardContent className={contentClassName ?? 'space-y-4'}>
                {children}
            </CardContent>
        </Card>
    );
}

export function AdminDetailEmptyText({ text }: { text: string }) {
    return (
        <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            {text}
        </div>
    );
}
