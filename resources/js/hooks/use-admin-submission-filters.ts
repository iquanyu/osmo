import { useCallback, useEffect, useRef, useState } from 'react';
import { useAdminSubmissionActions } from '@/hooks/use-admin-submission-actions';
import { defaultAdminSubmissionStatusFilter } from '@/lib/submission-status';
import type { AdminSubmissionStatusFilter } from '@/types';

interface Filters {
    search: string;
    status: AdminSubmissionStatusFilter;
}

export function useAdminSubmissionFilters(initialFilters: Filters) {
    const submissionActions = useAdminSubmissionActions();
    const [search, setSearch] = useState(initialFilters.search);
    const [status, setStatus] = useState<Filters['status']>(initialFilters.status);
    const skipAutoApplyRef = useRef(true);

    const applyFilters = useCallback(
        (nextStatus = status) => {
            submissionActions.list(
                {
                    search: search || undefined,
                    status: nextStatus,
                },
                { preserveState: true, preserveScroll: true },
            );
        },
        [search, status, submissionActions],
    );

    const applyStatusFilter = (nextStatus: Filters['status']) => {
        skipAutoApplyRef.current = true;
        setStatus(nextStatus);
        applyFilters(nextStatus);
    };

    const resetFilters = () => {
        skipAutoApplyRef.current = true;
        setSearch('');
        setStatus(defaultAdminSubmissionStatusFilter);

        submissionActions.list(
            { status: defaultAdminSubmissionStatusFilter },
            { preserveState: true, preserveScroll: true },
        );
    };

    useEffect(() => {
        if (skipAutoApplyRef.current) {
            skipAutoApplyRef.current = false;

            return;
        }

        const timer = window.setTimeout(() => {
            applyFilters();
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, applyFilters]);

    return {
        search,
        setSearch,
        status,
        setStatus,
        applyFilters,
        applyStatusFilter,
        resetFilters,
    };
}
