import { router } from '@inertiajs/react';
import { Compass } from 'lucide-react';
import { tutorialCategoryFilterOptions } from '@/lib/tutorial-meta';
import { index as tutorialsRoute } from '@/routes/tutorials';

interface Props {
    category: string;
}

export function TutorialCategoryFilter({ category }: Props) {
    const setCategory = (value: string) => {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q')?.trim() ?? '';

        router.get(
            tutorialsRoute.url(),
            {
                ...(value !== 'all' ? { category: value } : {}),
                ...(q ? { q } : {}),
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: ['tutorials', 'filters'],
                reset: ['tutorials'],
            },
        );
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-red-500" />
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    专业主题分栏：
                </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {tutorialCategoryFilterOptions.map((cat) => (
                    <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                            category === cat.value
                                ? 'bg-red-600 text-white'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
