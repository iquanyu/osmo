import {
    useAdminRouter
    
} from '@/hooks/use-admin-router';
import type {AdminRequestPayload} from '@/hooks/use-admin-router';
import { tutorials as adminTutorials } from '@/routes/admin';
import {
    create as createAdminTutorial,
    destroy as destroyAdminTutorial,
    edit as editAdminTutorial,
    meta as updateAdminTutorialMeta,
    store as storeAdminTutorial,
    update as updateAdminTutorial,
} from '@/routes/admin/tutorials';
import type { TutorialArticle } from '@/types';
import type { QueryParams } from '@/wayfinder';

export function useAdminTutorialActions() {
    const adminRouter = useAdminRouter();

    const listUrl = (query?: QueryParams) =>
        adminTutorials.url(query ? { query } : undefined);

    return {
        listUrl,
        createUrl: createAdminTutorial.url(),
        editUrl: (tutorialId: number) => editAdminTutorial.url(tutorialId),
        list: (
            query?: QueryParams,
            options?: Parameters<typeof adminRouter.get>[2],
        ) => adminRouter.get(adminTutorials(), query, options),
        visitList: (options?: Parameters<typeof adminRouter.visit>[1]) =>
            adminRouter.visit(adminTutorials(), options),
        deleteTutorial: (
            tutorialId: number,
            options?: Parameters<typeof adminRouter.delete>[1],
        ) => adminRouter.delete(destroyAdminTutorial(tutorialId), options),
        updateMeta: (
            tutorialId: number,
            payload: Partial<
                Pick<TutorialArticle, 'status' | 'sort_order' | 'is_featured'>
            >,
            options?: Parameters<typeof adminRouter.patch>[2],
        ) =>
            adminRouter.patch(
                updateAdminTutorialMeta(tutorialId),
                payload,
                options,
            ),
        createTutorial: (
            payload: AdminRequestPayload,
            options?: Parameters<typeof adminRouter.submit>[2],
        ) => adminRouter.submit(storeAdminTutorial(), payload, options),
        saveTutorial: (
            tutorialId: number,
            payload: AdminRequestPayload,
            options?: Parameters<typeof adminRouter.put>[2],
        ) => adminRouter.put(updateAdminTutorial(tutorialId), payload, options),
    };
}
