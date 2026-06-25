import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Pin,
    Search,
    Send,
    ShieldAlert,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { AdminActionButton } from '@/components/admin-action-button';
import { AdminCommunityMeta } from '@/components/admin-community-meta';
import { AdminDetailActionPanel } from '@/components/admin-detail-action-panel';
import { AdminEmptyState } from '@/components/admin-empty-state';
import { AdminFilterToolbar } from '@/components/admin-filter-toolbar';
import {
    AdminListCard,
    AdminListCardBody,
    AdminListCardHeader,
} from '@/components/admin-list-card';
import { AdminListPrimary } from '@/components/admin-list-primary';
import { AdminStatCard } from '@/components/admin-stat-card';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { PaginationLinks } from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAdminCommunityActions } from '@/hooks/use-admin-community-actions';
import { useAdminCommunityFilters } from '@/hooks/use-admin-community-filters';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { adminCommunitySortOptions } from '@/lib/community-meta';
import {
    community as adminCommunityRoute,
    index as adminIndex,
    submissions as adminSubmissionsRoute,
} from '@/routes/admin';
import type { AdminCommunityPageProps, CommunitySort } from '@/types';

AdminCommunity.layout = {
    breadcrumbs: [
        { title: '运营总览', href: adminIndex.url() },
        { title: '社区管理', href: adminCommunityRoute.url() },
    ],
};

export default function AdminCommunity({
    stats,
    posts,
    availableTags,
    filters,
}: AdminCommunityPageProps) {
    const communityActions = useAdminCommunityActions();
    const {
        search,
        setSearch,
        tag,
        setTag,
        sort,
        setSort,
        resetFilters,
        applyFilters,
    } = useAdminCommunityFilters(filters);
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    const { ask, confirmDialog } = useConfirmDialog();

    const handleDeletePost = (id: number) => {
        ask({
            title: '删除帖子',
            description: '确定要删除这篇帖子吗？此操作不可撤销。',
            confirmLabel: '删除',
            variant: 'destructive',
            onConfirm: () =>
                new Promise<void>((resolve) => {
                setPendingAction(`delete:${id}`);
                communityActions.deletePost(id, {
                    preserveScroll: true,
                    onFinish: () => setPendingAction(null),
                    onSuccess: () => resolve(),
                    onError: () => resolve(),
                });
                }),
        });
    };

    const handleTogglePin = (id: number) => {
        setPendingAction(`pin:${id}`);
        communityActions.togglePin(id, {
            preserveScroll: true,
            onFinish: () => setPendingAction(null),
        });
    };

    return (
        <>
            <Head title="社区管理" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">
                <DashboardPageHeader
                    eyebrow="Community"
                    title="社区管理"
                    description={`当前共 ${stats.postCount} 篇帖子，累计 ${stats.totalLikes} 次点赞，${stats.pinnedCount} 篇置顶。`}
                    icon={Send}
                />

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <AdminStatCard title="帖子总数" value={stats.postCount} />
                    <AdminStatCard title="累计点赞" value={stats.totalLikes} />
                    <AdminStatCard title="累计回复" value={stats.totalAnswers} />
                    <AdminStatCard title="置顶帖" value={stats.pinnedCount} />
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-base">社区帖列表</CardTitle>
                            <CardDescription>
                                列表负责检索和轻操作，详情页负责正文、回复和官方处理
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <AdminFilterToolbar
                                filters={
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div className="relative">
                                            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                placeholder="搜索发帖者..."
                                                className="h-9 pl-9 text-sm"
                                                aria-label="搜索发帖者"
                                            />
                                        </div>
                                        <select
                                            value={tag}
                                            onChange={(e) => setTag(e.target.value)}
                                            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                            aria-label="标签筛选"
                                        >
                                            <option value="all">全部标签</option>
                                            {availableTags.map((currentTag) => (
                                                <option
                                                    key={currentTag}
                                                    value={currentTag}
                                                >
                                                    {currentTag}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={sort}
                                            onChange={(e) =>
                                                setSort(e.target.value as CommunitySort)
                                            }
                                            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                            aria-label="排序方式"
                                        >
                                            {adminCommunitySortOptions.map(
                                                (option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
                                }
                                onReset={resetFilters}
                                onApply={applyFilters}
                            />

                            {posts.data.length === 0 ? (
                                <AdminEmptyState
                                    icon={Send}
                                    title="暂无匹配帖子"
                                    description="换个筛选条件试试，或者稍后再来看新的社区内容。"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {posts.data.map((post) => (
                                        <AdminListCard
                                            key={post.id}
                                            className={`overflow-hidden rounded-lg border ${
                                                post.pinned
                                                    ? 'border-red-300 dark:border-red-800'
                                                    : 'border-border'
                                            }`}
                                        >
                                            <AdminListCardHeader>
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className="text-sm font-medium">
                                                            {post.author}
                                                        </span>
                                                        {post.tags?.map(
                                                            (currentTag) => (
                                                                <Badge
                                                                    key={currentTag}
                                                                    variant="outline"
                                                                    className="text-[10px]"
                                                                >
                                                                    {currentTag}
                                                                </Badge>
                                                            ),
                                                        )}
                                                        {post.pinned ? (
                                                            <Badge className="border border-red-500/20 bg-red-500/10 text-[10px] text-red-600 dark:text-red-400">
                                                                <Pin className="mr-0.5 h-2.5 w-2.5 fill-current" />
                                                                置顶
                                                            </Badge>
                                                        ) : null}
                                                    </div>
                                                    <div className="mt-1">
                                                        <AdminCommunityMeta
                                                            author={post.author}
                                                            createdAt={post.created_at}
                                                            views={post.views}
                                                            likes={post.likes}
                                                            replies={
                                                                post.answers_count ??
                                                                0
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <AdminActionButton
                                                        variant="outline"
                                                        size="sm"
                                                        pending={
                                                            pendingAction ===
                                                            `pin:${post.id}`
                                                        }
                                                        disabled={pendingAction !== null}
                                                        icon={
                                                            <Pin className="mr-1 h-3.5 w-3.5" />
                                                        }
                                                        onClick={() =>
                                                            handleTogglePin(
                                                                post.id,
                                                            )
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {post.pinned
                                                            ? '取消置顶'
                                                            : '置顶'}
                                                    </AdminActionButton>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={communityActions.detailUrl(
                                                                post.id,
                                                            )}
                                                        >
                                                            详情
                                                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                                        </Link>
                                                    </Button>
                                                    <AdminActionButton
                                                        variant="outline"
                                                        size="sm"
                                                        pending={
                                                            pendingAction ===
                                                            `delete:${post.id}`
                                                        }
                                                        disabled={pendingAction !== null}
                                                        onClick={() =>
                                                            handleDeletePost(
                                                                post.id,
                                                            )
                                                        }
                                                        className="text-xs text-red-600"
                                                        aria-label="删除帖子"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </AdminActionButton>
                                                </div>
                                            </AdminListCardHeader>
                                            <AdminListCardBody>
                                                <AdminListPrimary
                                                    title={post.title}
                                                    description={post.content}
                                                    descriptionClassName="line-clamp-3 text-sm whitespace-pre-line text-muted-foreground"
                                                />
                                                {post.has_official_answer ? (
                                                    <div className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                                                        <ShieldAlert className="h-3.5 w-3.5" />
                                                        已有官方回复
                                                    </div>
                                                ) : null}
                                            </AdminListCardBody>
                                        </AdminListCard>
                                    ))}
                                </div>
                            )}
                            <PaginationLinks pagination={posts} />
                        </CardContent>
                    </Card>

                    <AdminDetailActionPanel
                        title="后台动作"
                        description="统一后台动作语气，直接查看审核、返回总览。"
                        actions={[
                            {
                                label: '查看审核',
                                onClick: () =>
                                    router.visit(
                                        adminSubmissionsRoute.url({
                                            query: { status: 'pending' },
                                        }),
                                        {
                                            preserveScroll: true,
                                            preserveState: true,
                                            replace: true,
                                        },
                                    ),
                                variant: 'default',
                                priority: 0,
                            },
                            {
                                label: '返回总览',
                                onClick: () =>
                                    router.visit(adminIndex.url(), {
                                        preserveScroll: true,
                                        preserveState: true,
                                        replace: true,
                                    }),
                                variant: 'outline',
                                priority: 1,
                            },
                        ]}
                    />
                </div>
            </div>
            {confirmDialog}
        </>
    );
}
