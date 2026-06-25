import type { Submission, SubmissionStatus } from '@/types';

export type SubmissionStatusDisplayMode = 'admin' | 'contribute';
export type SubmissionStatusFilter = 'all' | SubmissionStatus;
export type AdminSubmissionStatusFilter = Exclude<
    SubmissionStatus,
    'draft'
>;

export interface SubmissionStatusMeta {
    label: string;
    shortLabel: string;
    tone: string;
}

const submissionStatusMetaMap: Record<
    SubmissionStatus,
    Record<SubmissionStatusDisplayMode, SubmissionStatusMeta>
> = {
    draft: {
        admin: {
            label: '草稿',
            shortLabel: '草稿',
            tone: 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400',
        },
        contribute: {
            label: '草稿',
            shortLabel: '草稿',
            tone: 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
        },
    },
    pending: {
        admin: {
            label: '待审核',
            shortLabel: '待审',
            tone: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',
        },
        contribute: {
            label: '审核中',
            shortLabel: '审核中',
            tone: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',
        },
    },
    approved: {
        admin: {
            label: '已通过',
            shortLabel: '通过',
            tone: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400',
        },
        contribute: {
            label: '已通过',
            shortLabel: '通过',
            tone: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400',
        },
    },
    rejected: {
        admin: {
            label: '已驳回',
            shortLabel: '驳回',
            tone: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400',
        },
        contribute: {
            label: '已驳回',
            shortLabel: '驳回',
            tone: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
        },
    },
};

export const contributorSubmissionStatusTabs: Array<{
    value: SubmissionStatusFilter;
    label: string;
}> = [
    { value: 'all', label: '全部' },
    { value: 'draft', label: '草稿' },
    { value: 'pending', label: '审核中' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已驳回' },
];

export const adminSubmissionStatusOptions: Array<{
    value: AdminSubmissionStatusFilter;
    label: string;
}> = [
    { value: 'pending', label: '待审核' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已驳回' },
];

export const defaultAdminSubmissionStatusFilter: AdminSubmissionStatusFilter =
    'pending';

export const adminSubmissionQuickFilters = adminSubmissionStatusOptions;

export function getAdminSubmissionListMeta(
    status: AdminSubmissionStatusFilter,
): {
    title: string;
    emptyText: string;
} {
    if (status === 'approved') {
        return {
            title: '已通过记录',
            emptyText: '暂无已通过投稿',
        };
    }

    if (status === 'rejected') {
        return {
            title: '已驳回记录',
            emptyText: '暂无已驳回投稿',
        };
    }

    return {
        title: '待审核队列',
        emptyText: '暂无待审核的投稿',
    };
}

export function getSubmissionStatusMeta(
    status: SubmissionStatus,
    mode: SubmissionStatusDisplayMode = 'admin',
): SubmissionStatusMeta {
    return submissionStatusMetaMap[status][mode];
}

export function getSubmissionStatusLabel(
    status: SubmissionStatus,
    mode: SubmissionStatusDisplayMode = 'admin',
): string {
    return getSubmissionStatusMeta(status, mode).label;
}

export function getSubmissionStatusTone(
    status: SubmissionStatus,
    mode: SubmissionStatusDisplayMode = 'admin',
): string {
    return getSubmissionStatusMeta(status, mode).tone;
}

export function isSubmissionEditable(status: SubmissionStatus): boolean {
    return status === 'draft' || status === 'rejected';
}

export function isSubmissionPendingReview(status: SubmissionStatus): boolean {
    return status === 'pending';
}

export function isSubmissionReviewed(status: SubmissionStatus): boolean {
    return status === 'approved' || status === 'rejected';
}

export function formatSubmissionTime(
    submission: Submission,
    mode: SubmissionStatusDisplayMode = 'contribute',
): string {
    const toLocalString = (value: string) =>
        new Date(value).toLocaleString('zh-CN');

    if (isSubmissionPendingReview(submission.status) && submission.submitted_at) {
        const prefix = mode === 'admin' ? '' : '提交于 ';

        return `${prefix}${toLocalString(submission.submitted_at)}`;
    }

    if (isSubmissionReviewed(submission.status) && submission.reviewed_at) {
        const prefix = mode === 'admin' ? '' : '审核于 ';

        return `${prefix}${toLocalString(submission.reviewed_at)}`;
    }

    const prefix = mode === 'admin' ? '' : '更新于 ';

    return `${prefix}${toLocalString(submission.updated_at)}`;
}
