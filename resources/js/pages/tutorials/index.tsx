import { Head, InfiniteScroll } from '@inertiajs/react';
import { TutorialCard } from '@/components/tutorials/tutorial-card';
import { TutorialCategoryFilter } from '@/components/tutorials/tutorial-category-filter';
import { TutorialCommunityCta } from '@/components/tutorials/tutorial-community-cta';
import { TutorialHero } from '@/components/tutorials/tutorial-hero';
import { Spinner } from '@/components/ui/spinner';
import type { TutorialIndexPageProps } from '@/types';

export default function TutorialsIndex({
    tutorials,
    filters,
}: TutorialIndexPageProps) {
    const listTitle = filters.q
        ? `搜索「${filters.q}」`
        : filters.category === 'all'
          ? '全部教程'
          : '分类教程';

    return (
        <>
            <Head title="教程库" />

            <TutorialHero />
            <TutorialCommunityCta />

            <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
                <TutorialCategoryFilter category={filters.category} />

                <div className="space-y-6">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <h2 className="text-sm font-bold tracking-wider text-foreground uppercase">
                            {listTitle}
                        </h2>
                        {tutorials.total > 0 && (
                            <p className="text-xs text-muted-foreground">
                                共 {tutorials.total} 篇
                                {tutorials.last_page > 1 &&
                                    ` · 已加载 ${tutorials.data.length} 篇`}
                            </p>
                        )}
                    </div>

                    {tutorials.data.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
                            <p className="text-sm text-muted-foreground">
                                {filters.q
                                    ? '没有找到匹配的教程，试试其他关键词或清除搜索。'
                                    : '当前分类下暂无教程，试试切换其他主题或查看全部教程。'}
                            </p>
                        </div>
                    ) : (
                        <InfiniteScroll
                            data="tutorials"
                            onlyNext
                            loading={() => (
                                <div className="flex justify-center py-8">
                                    <Spinner className="h-5 w-5 text-muted-foreground" />
                                </div>
                            )}
                        >
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {tutorials.data.map((tutorial) => (
                                    <TutorialCard
                                        key={tutorial.id}
                                        tutorial={tutorial}
                                    />
                                ))}
                            </div>
                        </InfiniteScroll>
                    )}
                </div>
            </div>
        </>
    );
}
