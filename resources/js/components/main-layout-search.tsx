import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { community as communityRoute } from '@/routes';
import { index as tutorialsRoute } from '@/routes/tutorials';

const DEBOUNCE_MS = 300;

export function MainLayoutSearch({
    className = '',
}: {
    className?: string;
}) {
    const page = usePage();
    const { component, url: pageUrlString } = page;
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const isCommunityContext = isCurrentOrParentUrl(communityRoute.url());

    const pageUrl = new URL(
        pageUrlString,
        typeof window !== 'undefined'
            ? window.location.origin
            : 'http://localhost',
    );
    const urlQuery = pageUrl.searchParams.get('q') ?? '';

    const [draftSearch, setDraftSearch] = useState<string | null>(null);
    const search = draftSearch ?? urlQuery;

    useEffect(() => {
        const trimmed = search.trim();

        if (trimmed === urlQuery) {
            return;
        }

        const timer = window.setTimeout(() => {
            if (isCommunityContext) {
                router.get(
                    communityRoute.url(),
                    trimmed ? { q: trimmed } : {},
                    {
                        preserveScroll: true,
                        preserveState: true,
                        replace: true,
                        onSuccess: () => setDraftSearch(null),
                        ...(component === 'community/index'
                            ? { only: ['posts', 'filters', 'hotCommunityPosts'] }
                            : {}),
                    },
                );

                return;
            }

            const currentPageUrl = new URL(
                page.url,
                window.location.origin,
            );
            const category = currentPageUrl.searchParams.get('category');
            const isOnTutorials = isCurrentOrParentUrl(tutorialsRoute.url());

            router.get(
                tutorialsRoute.url(),
                {
                    ...(trimmed ? { q: trimmed } : {}),
                    ...(isOnTutorials &&
                    category &&
                    category !== 'all'
                        ? { category }
                        : {}),
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                    onSuccess: () => setDraftSearch(null),
                    ...(component === 'tutorials/index'
                        ? {
                              only: ['tutorials', 'filters'],
                              reset: ['tutorials'],
                          }
                        : {}),
                },
            );
        }, DEBOUNCE_MS);

        return () => window.clearTimeout(timer);
    }, [
        search,
        urlQuery,
        isCommunityContext,
        component,
        page.url,
        isCurrentOrParentUrl,
    ]);

    const placeholder = isCommunityContext
        ? '搜索社区帖子...'
        : '搜索教程...';

    return (
        <div className={`relative min-w-0 flex-1 ${className}`}>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={search}
                onChange={(event) => setDraftSearch(event.target.value)}
                placeholder={placeholder}
                className="h-9 pl-9 text-sm"
                type="search"
                enterKeyHint="search"
            />
        </div>
    );
}
