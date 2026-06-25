import type { ComponentProps, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface Props extends ComponentProps<typeof Button> {
    pending?: boolean;
    pendingLabel?: string;
    icon?: ReactNode;
}

export function AdminActionButton({
    pending = false,
    pendingLabel,
    icon,
    children,
    disabled,
    asChild = false,
    ...props
}: Props) {
    if (asChild) {
        return (
            <Button {...props} asChild disabled={disabled || pending}>
                {children}
            </Button>
        );
    }

    return (
        <Button {...props} disabled={disabled || pending}>
            {pending ? <Spinner className="h-4 w-4" /> : icon}
            {pending ? (pendingLabel ?? children) : children}
        </Button>
    );
}
