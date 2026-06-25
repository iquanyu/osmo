import { useCallback, useEffect, useRef, useState } from 'react';
import { useAdminTutorialActions } from '@/hooks/use-admin-tutorial-actions';
import { defaultAdminTutorialFilters } from '@/lib/tutorial-meta';
import type { AdminTutorialFilters } from '@/types';

export function useAdminTutorialFilters(initialFilters: AdminTutorialFilters) {
    const tutorialActions = useAdminTutorialActions();
    const [search, setSearch] = useState(initialFilters.search);
    const [category, setCategory] = useState(initialFilters.category);
    const [difficulty, setDifficulty] = useState(initialFilters.difficulty);
    const [status, setStatus] = useState(initialFilters.status);
    const [featured, setFeatured] = useState(initialFilters.featured);
    const skipAutoApplyRef = useRef(true);

    const buildFilterPayload = useCallback(
        (
            overrides?: Partial<{
                search: string;
                category: AdminTutorialFilters['category'];
                difficulty: AdminTutorialFilters['difficulty'];
                status: AdminTutorialFilters['status'];
                featured: AdminTutorialFilters['featured'];
            }>,
        ) => {
            const nextSearch = overrides?.search ?? search;
            const nextCategory = overrides?.category ?? category;
            const nextDifficulty = overrides?.difficulty ?? difficulty;
            const nextStatus = overrides?.status ?? status;
            const nextFeatured = overrides?.featured ?? featured;

            return {
                search: nextSearch || undefined,
                category:
                    nextCategory === defaultAdminTutorialFilters.category
                        ? undefined
                        : nextCategory,
                difficulty:
                    nextDifficulty === defaultAdminTutorialFilters.difficulty
                        ? undefined
                        : nextDifficulty,
                status:
                    nextStatus === defaultAdminTutorialFilters.status
                        ? undefined
                        : nextStatus,
                featured:
                    nextFeatured === defaultAdminTutorialFilters.featured
                        ? undefined
                        : nextFeatured,
            };
        },
        [search, category, difficulty, status, featured],
    );

    const applyFilters = useCallback(() => {
        tutorialActions.list(buildFilterPayload(), {
            preserveState: true,
        });
    }, [buildFilterPayload, tutorialActions]);

    useEffect(() => {
        if (skipAutoApplyRef.current) {
            skipAutoApplyRef.current = false;

            return;
        }

        const timer = window.setTimeout(() => {
            applyFilters();
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, category, difficulty, status, featured, applyFilters]);

    const resetFilters = () => {
        skipAutoApplyRef.current = true;
        setSearch('');
        setCategory(defaultAdminTutorialFilters.category);
        setDifficulty(defaultAdminTutorialFilters.difficulty);
        setStatus(defaultAdminTutorialFilters.status);
        setFeatured(defaultAdminTutorialFilters.featured);

        tutorialActions.list({}, {
            preserveState: true,
        });
    };

    const applyQuickFilters = (
        overrides: Partial<{
            status: AdminTutorialFilters['status'];
            featured: AdminTutorialFilters['featured'];
        }>,
    ) => {
        const nextStatus = overrides.status ?? status;
        const nextFeatured = overrides.featured ?? featured;

        skipAutoApplyRef.current = true;
        setStatus(nextStatus);
        setFeatured(nextFeatured);

        tutorialActions.list(
            buildFilterPayload({
                status: nextStatus,
                featured: nextFeatured,
            }),
            {
                preserveState: true,
            },
        );
    };

    return {
        search,
        setSearch,
        category,
        setCategory,
        difficulty,
        setDifficulty,
        status,
        setStatus,
        featured,
        setFeatured,
        applyFilters,
        resetFilters,
        applyQuickFilters,
    };
}
