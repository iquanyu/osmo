import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    ExternalLink,
    Search,
    Send,
    ShieldCheck,
    XCircle,
} from 'lucide-react';
import { AdminDetailActionPanel } from '@/components/admin-detail-action-panel';
import { AdminEmptyState } from '@/components/admin-empty-state';
import { AdminFilterToolbar } from '@/components/admin-filter-toolbar';
import {
    AdminListCard,
    AdminListCardBody,
    AdminListCardFooter,
} from '@/components/admin-list-card';
import { AdminStatCard } from '@/components/admin-stat-card';
import { AdminSubmissionListPrimary } from '@/components/admin-submission-list-primary';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { PaginationLinks } from '@/components/pagination-links';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAdminSubmissionActions } from '@/hooks/use-admin-submission-actions';
import { useAdminSubmissionFilters } from '@/hooks/use-admin-submission-filters';
import { useAdminTutorialActions } from '@/hooks/use-admin-tutorial-actions';
import {
    adminSubmissionQuickFilters,
    adminSubmissionStatusOptions,
    getAdminSubmissionListMeta,
    formatSubmissionTime,
} from '@/lib/submission-status';
import {
    community as adminCommunityRoute,
    index as adminIndex,
    submissions as adminSubmissionsRoute,
} from '@/routes/admin';
import type {
    AdminSubmissionsPageProps,
    AdminSubmissionStatusFilter,
} from '@/types';

AdminSubmissions.layout = {
    breadcrumbs: [
        { title: '运营总览', href: adminIndex.url() },
        { title: '投稿审核', href: adminSubmissionsRoute.url() },
    ],
};

export default function AdminSubmissions({
    pendingCount,
    approvedCount,
    rejectedCount,
    submissions,
    filters,
}: AdminSubmissionsPageProps) {
    const submissionActions = useAdminSubmissionActions();
    const tutorialActions = useAdminTutorialActions();
    const {
        search,
        setSearch,
        status,
        applyFilters,
        applyStatusFilter,
        resetFilters,
    } = useAdminSubmissionFilters(filters);

    const { title: listTitle, emptyText: listEmptyText } =
        getAdminSubmissionListMeta(status);

    return (
        <>
            <Head title="投稿审核" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">
                <DashboardPageHeader
                    eyebrow="Review Center"
                    title="投稿审核"
                    description="统一查看待审核、已通过、已驳回记录，详情页负责完整审阅。"
                    icon={ShieldCheck}
                />

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <AdminStatCard
                        title="待审核"
                        value={pendingCount}
                        note="当前队列"
                        icon={<Clock className="h-4 w-4 text-amber-500" />}
                        active={status === 'pending'}
                        onClick={() => applyStatusFilter('pending')}
                    />
                    <AdminStatCard
                        title="已通过"
                        value={approvedCount}
                        note="累计"
                        icon={
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        }
                        active={status === 'approved'}
                        onClick={() => applyStatusFilter('approved')}
                    />
                    <AdminStatCard
                        title="已驳回"
                        value={rejectedCount}
                        note="累计"
                        icon={<XCircle className="h-4 w-4 text-rose-500" />}
                        active={status === 'rejected'}
                        onClick={() => applyStatusFilter('rejected')}
                    />
                    <AdminStatCard
                        title="当前页"
                        value={submissions.data.length}
                        note="本页展示"
                        icon={<Send className="h-4 w-4 text-sky-500" />}
                    />
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-base">{listTitle}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AdminFilterToolbar
                                filters={
                                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
                                        <div className="relative min-w-[240px] flex-1">
                                            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                placeholder="搜索标题、投稿人或邮箱..."
                                                className="h-9 pl-9 text-sm"
                                                aria-label="搜索投稿"
                                            />
                                        </div>
                                        <select
                                            value={status}
                                            onChange={(e) =>
                                                applyStatusFilter(
                                                    e.target
                                                        .value as AdminSubmissionStatusFilter,
                                                )
                                            }
                                            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                            aria-label="审核状态"
                                        >
                                            {adminSubmissionStatusOptions.map(
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
                                        {adminSubmissionQuickFilters.map(
                                            (option) => (
                                                <Button
                                                    key={option.value}
                                                    variant={
                                                        status === option.value
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        applyStatusFilter(
                                                            option.value,
                                                        )
                                                    }
                                                >
                                                    {option.label}
                                                </Button>
                                            ),
                                        )}
                                    </>
                                }
                                onReset={resetFilters}
                                onApply={() => applyFilters()}
                            />

                            {submissions.data.length === 0 ? (
                                <AdminEmptyState
                                    icon={ShieldCheck}
                                    title="当前筛选下暂无记录"
                                    description={listEmptyText}
                                />
                            ) : (
                                <div className="space-y-3">
                                    {submissions.data.map((submission) => (
                                        <AdminListCard
                                            key={submission.id}
                                            className="rounded-xl border border-sidebar-border/70 transition-colors hover:bg-muted/40 dark:border-sidebar-border"
                                        >
                                            <AdminListCardBody className="space-y-3 p-4">
                                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                                    <Link
                                                        href={submissionActions.detailUrl(
                                                            submission.id,
                                                        )}
                                                        className="min-w-0 flex-1 space-y-2"
                                                    >
                                                        <AdminSubmissionListPrimary
                                                            submission={submission}
                                                        />

                                                        {submission.review_note ? (
                                                            <p className="line-clamp-1 text-xs text-rose-600 dark:text-rose-400">
                                                                驳回备注：
                                                                {
                                                                    submission.review_note
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </Link>

                                                    <AdminListCardFooter className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        {submission.status ===
                                                            'approved' &&
                                                        submission.published_tutorial_id ? (
                                                            <Link
                                                                href={tutorialActions.editUrl(
                                                                    submission.published_tutorial_id,
                                                                )}
                                                                className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                                            >
                                                                已入库：
                                                                {submission
                                                                    .published_tutorial
                                                                    ?.title ||
                                                                    '查看教程'}
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Link>
                                                        ) : null}
                                                        <div className="text-right">
                                                            <div>
                                                                {formatSubmissionTime(
                                                                    submission,
                                                                    'admin',
                                                                )}
                                                            </div>
                                                            <div className="mt-1">
                                                                {submission.status ===
                                                                'pending'
                                                                    ? '查看详情并审核'
                                                                    : '查看详情'}
                                                            </div>
                                                        </div>
                                                        <Link
                                                            href={submissionActions.detailUrl(
                                                                submission.id,
                                                            )}
                                                            aria-label="查看详情"
                                                        >
                                                            <ArrowRight className="h-4 w-4" />
                                                        </Link>
                                                    </AdminListCardFooter>
                                                </div>
                                            </AdminListCardBody>
                                        </AdminListCard>
                                    ))}
                                </div>
                            )}

                            <PaginationLinks pagination={submissions} />
                        </CardContent>
                    </Card>

                    <AdminDetailActionPanel
                        title="后台动作"
                        description="统一后台动作语气，直接查看社区、返回总览。"
                        actions={[
                            {
                                label: '查看社区',
                                onClick: () =>
                                    router.visit(
                                        adminCommunityRoute.url({
                                            query: { sort: 'newest' },
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
        </>
    );
}
