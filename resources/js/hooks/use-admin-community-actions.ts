import { useAdminRouter } from '@/hooks/use-admin-router';
import { community as adminCommunity } from '@/routes/admin';
import {
    destroy as destroyCommunityPost,
    officialAnswer as publishOfficialAnswer,
    pin as toggleCommunityPin,
    show as showCommunityPost,
} from '@/routes/admin/community';
import type { QueryParams } from '@/wayfinder';

export function useAdminCommunityActions() {
    const adminRouter = useAdminRouter();

    const listUrl = (query?: QueryParams) =>
        adminCommunity.url(query ? { query } : undefined);

    return {
        listUrl,
        detailUrl: (postId: number) => showCommunityPost.url(postId),
        list: (
            query?: QueryParams,
            options?: Parameters<typeof adminRouter.get>[2],
        ) => adminRouter.get(adminCommunity(), query, options),
        deletePost: (
            postId: number,
            options?: Parameters<typeof adminRouter.delete>[1],
        ) => adminRouter.delete(destroyCommunityPost(postId), options),
        togglePin: (
            postId: number,
            options?: Parameters<typeof adminRouter.post>[2],
        ) => adminRouter.post(toggleCommunityPin(postId), {}, options),
        publishOfficialAnswer: (
            postId: number,
            content: string,
            options?: Parameters<typeof adminRouter.post>[2],
        ) =>
            adminRouter.post(
                publishOfficialAnswer(postId),
                { content },
                options,
            ),
    };
}
