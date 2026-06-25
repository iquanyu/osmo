import { useCallback, useState } from 'react';
import { AdminConfirmDialog } from '@/components/admin-confirm-dialog';

type ConfirmConfig = {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive';
    onConfirm: () => void | Promise<void>;
};

export function useConfirmDialog() {
    const [config, setConfig] = useState<ConfirmConfig | null>(null);
    const [loading, setLoading] = useState(false);

    const ask = useCallback((next: ConfirmConfig) => {
        setConfig(next);
    }, []);

    const close = useCallback(() => {
        if (!loading) {
            setConfig(null);
        }
    }, [loading]);

    const runConfirm = useCallback(async () => {
        if (!config) {
            return;
        }

        const result = config.onConfirm();

        if (result && typeof (result as Promise<void>).then === 'function') {
            setLoading(true);

            try {
                await result;
            } finally {
                setLoading(false);
                setConfig(null);
            }

            return;
        }

        setConfig(null);
    }, [config]);

    const confirmDialog = config ? (
        <AdminConfirmDialog
            open
            onOpenChange={(open) => {
                if (!open) {
                    close();
                }
            }}
            title={config.title}
            description={config.description}
            confirmLabel={config.confirmLabel}
            cancelLabel={config.cancelLabel}
            variant={config.variant}
            loading={loading}
            onConfirm={runConfirm}
        />
    ) : null;

    return { ask, confirmDialog, setLoading, close };
}
