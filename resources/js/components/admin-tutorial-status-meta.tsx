import { Badge } from '@/components/ui/badge';
import type { TutorialArticle } from '@/types';

export function AdminTutorialStatusMeta({
    tutorial,
}: {
    tutorial: Pick<
        TutorialArticle,
        'status' | 'is_featured' | 'sort_order' | 'difficulty' | 'duration'
    >;
}) {
    return (
        <>
            <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                    variant={tutorial.status === 'published' ? 'default' : 'outline'}
                    className="text-[10px]"
                >
                    {tutorial.status === 'published' ? '已发布' : '草稿'}
                </Badge>
                {tutorial.is_featured ? (
                    <Badge variant="secondary" className="text-[10px]">
                        推荐
                    </Badge>
                ) : null}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
                排序 {tutorial.sort_order} · {tutorial.difficulty} /{' '}
                {tutorial.duration}
            </p>
        </>
    );
}
