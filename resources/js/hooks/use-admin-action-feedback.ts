import { toast } from 'sonner';

type ErrorBag = Record<string, string | string[] | undefined>;

function hasValidationErrors(errors?: ErrorBag): boolean {
    return Object.values(errors ?? {}).some((value) => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }

        return Boolean(value);
    });
}

export function useAdminActionFeedback() {
    const actionError =
        (fallbackMessage: string) =>
        (errors?: ErrorBag): void => {
            if (hasValidationErrors(errors)) {
                return;
            }

            toast.error(fallbackMessage);
        };

    const formError =
        (
            fallbackMessage: string,
            validationMessage = '请检查表单内容后重试',
        ) =>
        (errors?: ErrorBag): void => {
            toast.error(
                hasValidationErrors(errors)
                    ? validationMessage
                    : fallbackMessage,
            );
        };

    return {
        actionError,
        formError,
    };
}
