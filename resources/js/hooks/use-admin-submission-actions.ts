import { useAdminRouter } from '@/hooks/use-admin-router';
import { submissions as adminSubmissions } from '@/routes/admin';
import {
    approve as approveSubmission,
    reject as rejectSubmission,
    show as showAdminSubmission,
} from '@/routes/admin/submissions';
import type { QueryParams } from '@/wayfinder';

export function useAdminSubmissionActions() {
    const adminRouter = useAdminRouter();

    const listUrl = (query?: QueryParams) =>
        adminSubmissions.url(query ? { query } : undefined);

    return {
        listUrl,
        detailUrl: (submissionId: number) =>
            showAdminSubmission.url(submissionId),
        list: (
            query?: QueryParams,
            options?: Parameters<typeof adminRouter.get>[2],
        ) => adminRouter.get(adminSubmissions(), query, options),
        approve: (
            submissionId: number,
            options?: Parameters<typeof adminRouter.post>[2],
        ) => adminRouter.post(approveSubmission(submissionId), {}, options),
        reject: (
            submissionId: number,
            reviewNote: string,
            options?: Parameters<typeof adminRouter.post>[2],
        ) =>
            adminRouter.post(
                rejectSubmission(submissionId),
                { review_note: reviewNote },
                options,
            ),
    };
}
