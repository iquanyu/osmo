import { useCallback, useEffect, useRef, useState } from 'react';
import { useAdminCommunityActions } from '@/hooks/use-admin-community-actions';
import { defaultAdminCommunitySort } from '@/lib/community-meta';
import type { AdminCommunityFilters } from '@/types';

export function useAdminCommunityFilters(initialFilters: AdminCommunityFilters) {
    const communityActions = useAdminCommunityActions();
    const [search, setSearch] = useState(initialFilters.search);
    const [tag, setTag] = useState(initialFilters.tag);
    const [sort, setSort] = useState(initialFilters.sort);
    const skipAutoApplyRef = useRef(true);

    const applyFilters = useCallback(() => {
        communityActions.list(
            {
                search: search || undefined,
                tag: tag === 'all' ? undefined : tag,
                sort: sort === defaultAdminCommunitySort ? undefined : sort,
            },
            { preserveState: true, preserveScroll: true },
        );
    }, [communityActions, search, tag, sort]);

    useEffect(() => {
        if (skipAutoApplyRef.current) {
            skipAutoApplyRef.current = false;

            return;
        }

        const timer = window.setTimeout(() => {
            applyFilters();
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, tag, sort, applyFilters]);

    const resetFilters = () => {
        skipAutoApplyRef.current = true;
        setSearch('');
        setTag('all');
        setSort(defaultAdminCommunitySort);

        communityActions.list({}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return {
        search,
        setSearch,
        tag,
        setTag,
        sort,
        setSort,
        applyFilters,
        resetFilters,
    };
}
