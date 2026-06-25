import { router } from '@inertiajs/react';
import { useAdminActionFeedback } from '@/hooks/use-admin-action-feedback';

type RouteTarget = string | { url: string };
export type AdminRequestPayload = Parameters<typeof router.post>[1];
type GetOptions = NonNullable<Parameters<typeof router.get>[2]>;
type MutationOptions = NonNullable<Parameters<typeof router.post>[2]>;
type VisitOptions = NonNullable<Parameters<typeof router.visit>[1]>;
type ErrorBag = Record<string, string | string[] | undefined>;

interface FeedbackOptions {
    errorMessage?: string;
}

interface FormFeedbackOptions extends FeedbackOptions {
    validationMessage?: string;
}

function resolveUrl(target: RouteTarget): string {
    return typeof target === 'string' ? target : target.url;
}

export function useAdminRouter() {
    const { actionError, formError } = useAdminActionFeedback();

    const get = (
        target: RouteTarget,
        data?: AdminRequestPayload,
        options?: GetOptions,
    ) => {
        router.get(resolveUrl(target), data ?? {}, {
            preserveScroll: true,
            ...options,
        });
    };

    const visit = (target: RouteTarget, options?: VisitOptions) => {
        router.visit(resolveUrl(target), {
            preserveScroll: true,
            ...options,
        });
    };

    const post = (
        target: RouteTarget,
        data?: AdminRequestPayload,
        options?: MutationOptions & FeedbackOptions,
    ) => {
        const { errorMessage = '操作失败，请稍后重试', onError, ...rest } =
            options ?? {};

        router.post(resolveUrl(target), data ?? {}, {
            preserveScroll: true,
            ...rest,
            onError: (errors) => {
                onError?.(errors);
                actionError(errorMessage)(errors as ErrorBag);
            },
        });
    };

    const patch = (
        target: RouteTarget,
        data?: AdminRequestPayload,
        options?: MutationOptions & FeedbackOptions,
    ) => {
        const { errorMessage = '操作失败，请稍后重试', onError, ...rest } =
            options ?? {};

        router.patch(resolveUrl(target), data ?? {}, {
            preserveScroll: true,
            ...rest,
            onError: (errors) => {
                onError?.(errors);
                actionError(errorMessage)(errors as ErrorBag);
            },
        });
    };

    const put = (
        target: RouteTarget,
        data?: AdminRequestPayload,
        options?: MutationOptions & FormFeedbackOptions,
    ) => {
        const {
            errorMessage = '保存失败，请稍后重试',
            validationMessage,
            onError,
            ...rest
        } = options ?? {};

        router.put(resolveUrl(target), data ?? {}, {
            preserveScroll: true,
            ...rest,
            onError: (errors) => {
                onError?.(errors);
                formError(errorMessage, validationMessage)(errors as ErrorBag);
            },
        });
    };

    const destroy = (
        target: RouteTarget,
        options?: MutationOptions & FeedbackOptions,
    ) => {
        const { errorMessage = '删除失败，请稍后重试', onError, ...rest } =
            options ?? {};

        router.delete(resolveUrl(target), {
            preserveScroll: true,
            ...rest,
            onError: (errors) => {
                onError?.(errors);
                actionError(errorMessage)(errors as ErrorBag);
            },
        });
    };

    const submit = (
        target: RouteTarget,
        data?: AdminRequestPayload,
        options?: MutationOptions & FormFeedbackOptions,
    ) => {
        const {
            errorMessage = '保存失败，请稍后重试',
            validationMessage,
            onError,
            ...rest
        } = options ?? {};

        router.post(resolveUrl(target), data ?? {}, {
            preserveScroll: true,
            ...rest,
            onError: (errors) => {
                onError?.(errors);
                formError(errorMessage, validationMessage)(errors as ErrorBag);
            },
        });
    };

    return {
        get,
        visit,
        post,
        patch,
        put,
        delete: destroy,
        submit,
    };
}
