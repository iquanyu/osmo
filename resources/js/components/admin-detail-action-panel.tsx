import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type ActionItem = {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
    priority?: number;
    disabled?: boolean;
    pending?: boolean;
    pendingLabel?: string;
    tone?: 'default' | 'danger';
};

interface Props {
    title: string;
    description: string;
    actions: ActionItem[];
    children?: ReactNode;
}

export function AdminDetailActionPanel({
    title,
    description,
    actions,
    children,
}: Props) {
    const orderedActions = [...actions].sort((left, right) => {
        const leftPriority = left.priority ?? 0;
        const rightPriority = right.priority ?? 0;

        if (leftPriority !== rightPriority) {
            return leftPriority - rightPriority;
        }

        const getPriority = (variant?: ActionItem['variant']) => {
            if (variant === 'default') {
                return 0;
            }

            if (variant === 'secondary') {
                return 1;
            }

            if (variant === 'outline' || variant === 'ghost' || variant === 'link') {
                return 2;
            }

            if (variant === 'destructive') {
                return 3;
            }

            return 2;
        };

        return getPriority(left.variant) - getPriority(right.variant);
    });

    return (
        <Card className="sticky top-20 border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {orderedActions.map((action) => (
                    <Button
                        key={action.label}
                        variant={action.variant ?? 'outline'}
                        className="w-full justify-start gap-2 border-border bg-background text-left"
                        disabled={action.disabled || action.pending}
                        onClick={action.onClick}
                    >
                        {action.pending ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : action.icon ? (
                            <span className="h-4 w-4">{action.icon}</span>
                        ) : null}
                        <span>{action.pending && action.pendingLabel ? action.pendingLabel : action.label}</span>
                    </Button>
                ))}
                {children}
            </CardContent>
        </Card>
    );
}
