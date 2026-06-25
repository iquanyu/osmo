import { Star } from 'lucide-react';
import { AdminActionButton } from '@/components/admin-action-button';
import { Input } from '@/components/ui/input';
import type { TutorialArticle } from '@/types';

interface Props {
    tutorial: Pick<TutorialArticle, 'id' | 'status' | 'sort_order' | 'is_featured'>;
    pending: boolean;
    onToggleStatus: () => void;
    onToggleFeatured: () => void;
    onUpdateSortOrder: (nextValue: number) => void;
}

export function AdminTutorialRowActions({
    tutorial,
    pending,
    onToggleStatus,
    onToggleFeatured,
    onUpdateSortOrder,
}: Props) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <AdminActionButton
                variant="outline"
                size="sm"
                pending={pending}
                pendingLabel={tutorial.status === 'published' ? '转草稿中' : '发布中'}
                onClick={onToggleStatus}
            >
                {tutorial.status === 'published' ? '转草稿' : '发布'}
            </AdminActionButton>
            <AdminActionButton
                variant={tutorial.is_featured ? 'default' : 'outline'}
                size="sm"
                pending={pending}
                pendingLabel={tutorial.is_featured ? '取消推荐中' : '设为推荐中'}
                icon={<Star className="mr-1 h-3.5 w-3.5" />}
                onClick={onToggleFeatured}
            >
                {tutorial.is_featured ? '取消推荐' : '设推荐'}
            </AdminActionButton>
            <div className="flex items-center gap-1">
                <Input
                    type="number"
                    min={0}
                    defaultValue={tutorial.sort_order}
                    className="h-8 w-20 text-xs"
                    aria-label="排序权重"
                    onBlur={(e) => {
                        const nextValue = Number(e.target.value || 0);

                        if (nextValue !== tutorial.sort_order) {
                            onUpdateSortOrder(nextValue);
                        }
                    }}
                    disabled={pending}
                />
                <span className="text-[11px] text-muted-foreground">排序</span>
            </div>
        </div>
    );
}
