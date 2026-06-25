import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Edit2, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminActionButton } from '@/components/admin-action-button';
import { AdminDetailActionPanel } from '@/components/admin-detail-action-panel';
import { AdminEmptyState } from '@/components/admin-empty-state';
import { AdminFilterToolbar } from '@/components/admin-filter-toolbar';
import { AdminStatCard } from '@/components/admin-stat-card';
import { AdminTutorialRowActions } from '@/components/admin-tutorial-row-actions';
import { AdminTutorialStatusMeta } from '@/components/admin-tutorial-status-meta';
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
import { useAdminTutorialActions } from '@/hooks/use-admin-tutorial-actions';
import { useAdminTutorialFilters } from '@/hooks/use-admin-tutorial-filters';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import {
    adminTutorialQuickFilters,
    defaultAdminTutorialFilters,
    tutorialCategoryFilterOptions,
    tutorialDifficultyFilterOptions,
    tutorialFeaturedFilterOptions,
    tutorialStatusFilterOptions,
} from '@/lib/tutorial-meta';
import {
    community as adminCommunityRoute,
    index as adminIndex,
    submissions as adminSubmissionsRoute,
    tutorials as adminTutorialsRoute,
} from '@/routes/admin';
import type {
    AdminTutorialFilters,
    AdminTutorialsPageProps,
    TutorialArticle,
} from '@/types';

AdminTutorials.layout = {
    breadcrumbs: [
        { title: '运营总览', href: adminIndex.url() },
        { title: '教程管理', href: adminTutorialsRoute.url() },
    ],
};

export default function AdminTutorials({
    stats,
    tutorials,
    filters,
}: AdminTutorialsPageProps) {
    const tutorialActions = useAdminTutorialActions();
    const {
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
    } = useAdminTutorialFilters(filters);
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    const { ask, confirmDialog } = useConfirmDialog();

    const handleDeleteTutorial = (id: number) => {
        ask({
            title: '删除教程',
            description: '确定要删除这篇教程吗？此操作不可撤销。',
            confirmLabel: '删除',
            variant: 'destructive',
            onConfirm: () =>
                new Promise<void>((resolve) => {
                setPendingAction(`delete:${id}`);
                tutorialActions.deleteTutorial(id, {
                    preserveScroll: true,
                    onFinish: () => setPendingAction(null),
                    onSuccess: () => resolve(),
                    onError: () => resolve(),
                });
                }),
        });
    };

    const updateTutorialMeta = (
        tutorial: TutorialArticle,
        payload: Partial<
            Pick<TutorialArticle, 'status' | 'sort_order' | 'is_featured'>
        >,
    ) => {
        setPendingAction(`meta:${tutorial.id}`);
        tutorialActions.updateMeta(tutorial.id, payload, {
            preserveScroll: true,
            onFinish: () => setPendingAction(null),
        });
    };

    return (
        <>
            <Head title="教程管理" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">
                <DashboardPageHeader
                    eyebrow="Tutorial Library"
                    title="教程管理"
                    description={`当前共 ${stats.tutorialCount} 篇教程，另有 ${stats.pendingSubmissionCount} 篇投稿待审核。`}
                    icon={BookOpen}
                    actions={
                        <Button asChild>
                            <Link href={tutorialActions.createUrl}>
                                <Plus className="mr-1 h-4 w-4" />
                                新增教程
                            </Link>
                        </Button>
                    }
                />

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <AdminStatCard title="教程总数" value={stats.tutorialCount} />
                    <AdminStatCard
                        title="已发布"
                        value={stats.publishedTutorialCount}
                    />
                    <AdminStatCard title="草稿" value={stats.draftTutorialCount} />
                    <AdminStatCard
                        title="推荐位"
                        value={stats.featuredTutorialCount}
                    />
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="space-y-4">
                        <Card className="border-sidebar-border/70 bg-gradient-to-br from-red-950/10 via-background to-background dark:border-sidebar-border">
                            <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:items-center">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">
                                        教程工作台
                                    </p>
                                    <h2 className="text-lg font-extrabold tracking-tight text-foreground">
                                        先处理草稿和推荐，再进入具体编辑
                                    </h2>
                                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                        列表页承担筛选、状态切换和删除，真正的内容编辑已经拆到独立页面。你可以先看草稿数量，再决定是补内容还是调运营信息。
                                    </p>
                                </div>
                                <StatusHintCard
                                    label="草稿"
                                    value={stats.draftTutorialCount}
                                    description="优先清理草稿和待发布内容"
                                />
                                <StatusHintCard
                                    label="已发布"
                                    value={stats.publishedTutorialCount}
                                    description="检查内容是否要更新封面或参数"
                                />
                                <StatusHintCard
                                    label="推荐位"
                                    value={stats.featuredTutorialCount}
                                    description="保持首页精选数量合理"
                                />
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="text-base">教程库管理</CardTitle>
                                <CardDescription>
                                    列表页只负责筛选、查看和跳转编辑，新增与编辑已拆到独立页面
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                        <AdminFilterToolbar
                            filters={
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="搜索标题..."
                                            className="h-9 pl-9 text-sm"
                                            aria-label="搜索教程标题"
                                        />
                                    </div>
                                    <select
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(
                                                e.target
                                                    .value as AdminTutorialFilters['category'],
                                            )
                                        }
                                        className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                        aria-label="教程分类"
                                    >
                                        {tutorialCategoryFilterOptions.map(
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
                                    <select
                                        value={difficulty}
                                        onChange={(e) =>
                                            setDifficulty(
                                                e.target
                                                    .value as AdminTutorialFilters['difficulty'],
                                            )
                                        }
                                        className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                        aria-label="难度级别"
                                    >
                                        {tutorialDifficultyFilterOptions.map(
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
                                    <select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(
                                                e.target
                                                    .value as AdminTutorialFilters['status'],
                                            )
                                        }
                                        className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                        aria-label="发布状态"
                                    >
                                        {tutorialStatusFilterOptions.map(
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
                                    <select
                                        value={featured}
                                        onChange={(e) =>
                                            setFeatured(
                                                e.target
                                                    .value as AdminTutorialFilters['featured'],
                                            )
                                        }
                                        className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                        aria-label="推荐状态"
                                    >
                                        {tutorialFeaturedFilterOptions.map(
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
                            quickFilters={
                                <>
                                    {adminTutorialQuickFilters.map((filter) => {
                                        const matchesStatus =
                                            (filter.status ??
                                                defaultAdminTutorialFilters.status) ===
                                            status;
                                        const matchesFeatured =
                                            (filter.featured ??
                                                defaultAdminTutorialFilters.featured) ===
                                            featured;

                                        return (
                                            <Button
                                                key={filter.key}
                                                variant={
                                                    matchesStatus &&
                                                    matchesFeatured
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    applyQuickFilters({
                                                        status: filter.status,
                                                        featured:
                                                            filter.featured,
                                                    })
                                                }
                                            >
                                                {filter.label}
                                            </Button>
                                        );
                                    })}
                                </>
                            }
                            onReset={resetFilters}
                            onApply={applyFilters}
                        />

                        {tutorials.data.length === 0 ? (
                            <AdminEmptyState
                                icon={BookOpen}
                                title="暂无匹配教程"
                                description="试试调整筛选条件，或直接新增一篇教程。"
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground"
                                            >
                                                标题
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground"
                                            >
                                                参数
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground"
                                            >
                                                状态/排序
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground"
                                            >
                                                快速操作
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2.5 text-right text-xs font-medium text-muted-foreground"
                                            >
                                                操作
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tutorials.data.map((tutorial) => (
                                            <tr
                                                key={tutorial.id}
                                                className="border-b border-border hover:bg-muted/40"
                                            >
                                                <td className="max-w-xs px-3 py-3">
                                                    <p className="truncate text-sm font-medium">
                                                        {tutorial.title}
                                                    </p>
                                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                        {tutorial.summary}
                                                    </p>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {
                                                            tutorial.settings
                                                                .colorProfile
                                                        }
                                                    </Badge>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {
                                                            tutorial.settings
                                                                .resolution
                                                        }
                                                    </p>
                                                </td>
                                                <td className="px-3 py-3 text-xs text-muted-foreground">
                                                    <AdminTutorialStatusMeta
                                                        tutorial={tutorial}
                                                    />
                                                </td>
                                                <td
                                                    className="px-3 py-3"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <AdminTutorialRowActions
                                                        tutorial={tutorial}
                                                        pending={
                                                            pendingAction ===
                                                            `meta:${tutorial.id}`
                                                        }
                                                        onToggleStatus={() =>
                                                            updateTutorialMeta(
                                                                tutorial,
                                                                {
                                                                    status:
                                                                        tutorial.status ===
                                                                        'published'
                                                                            ? 'draft'
                                                                            : 'published',
                                                                },
                                                            )
                                                        }
                                                        onToggleFeatured={() =>
                                                            updateTutorialMeta(
                                                                tutorial,
                                                                {
                                                                    is_featured:
                                                                        !tutorial.is_featured,
                                                                },
                                                            )
                                                        }
                                                        onUpdateSortOrder={(
                                                            nextValue,
                                                        ) =>
                                                            updateTutorialMeta(
                                                                tutorial,
                                                                {
                                                                    sort_order:
                                                                        nextValue,
                                                                },
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td
                                                    className="px-3 py-3 text-right"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <div className="flex justify-end gap-1">
                                                        <AdminActionButton
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                        >
                                                            <Link
                                                                href={tutorialActions.editUrl(
                                                                    tutorial.id,
                                                                )}
                                                                aria-label="编辑教程"
                                                            >
                                                                <Edit2 className="h-3.5 w-3.5" />
                                                            </Link>
                                                        </AdminActionButton>
                                                        <AdminActionButton
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-red-600 hover:text-red-700"
                                                            pending={
                                                                pendingAction ===
                                                                `delete:${tutorial.id}`
                                                            }
                                                            aria-label="删除教程"
                                                            onClick={() =>
                                                                handleDeleteTutorial(
                                                                    tutorial.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </AdminActionButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <PaginationLinks pagination={tutorials} />
                            </CardContent>
                        </Card>
                    </div>

                    <AdminDetailActionPanel
                        title="后台动作"
                        description="统一后台动作语气，直接返回教程、查看审核、查看社区。"
                        actions={[
                            {
                                label: '返回教程',
                                onClick: () =>
                                    router.visit(tutorialActions.createUrl, {
                                        preserveScroll: true,
                                        preserveState: true,
                                        replace: true,
                                    }),
                                variant: 'default',
                                priority: 0,
                            },
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
                                variant: 'outline',
                                priority: 1,
                            },
                            {
                                label: '查看社区',
                                onClick: () =>
                                    router.visit(adminCommunityRoute.url(), {
                                        preserveScroll: true,
                                        preserveState: true,
                                        replace: true,
                                    }),
                                variant: 'outline',
                                priority: 2,
                            },
                        ]}
                    />
                </div>
            </div>
            {confirmDialog}
        </>
    );
}

function StatusHintCard({
    label,
    value,
    description,
}: {
    label: string;
    value: number;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-border bg-card/80 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">
                {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
    );
}
