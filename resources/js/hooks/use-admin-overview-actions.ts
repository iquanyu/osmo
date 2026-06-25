import { useAdminRouter } from '@/hooks/use-admin-router';
import { reset as resetDemoData } from '@/routes/admin';

export function useAdminOverviewActions() {
    const adminRouter = useAdminRouter();

    return {
        resetDemoData: (
            options?: Parameters<typeof adminRouter.post>[2],
        ) => adminRouter.post(resetDemoData(), {}, options),
    };
}
