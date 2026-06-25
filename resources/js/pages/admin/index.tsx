import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    Heart,
    LayoutDashboard,
    Pin,
    RotateCcw,
    ShieldAlert,
    ShieldCheck,
    Star,
} from 'lucide-react';
import { useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { AdminDetailActionPanel } from '@/components/admin-detail-action-panel';
import { AdminEmptyState } from '@/components/admin-empty-state';
import { AdminStatCard } from '@/components/admin-stat-card';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useAdminCommunityActions } from '@/hooks/use-admin-community-actions';
import { useAdminOverviewActions } from '@/hooks/use-admin-overview-actions';
import { useAdminTutorialActions } from '@/hooks/use-admin-tutorial-actions';
import { useAppearance } from '@/hooks/use-appearance';
import {
    community as adminCommunity,
    submissions as adminSubmissions,
    tutorials as adminTutorialsRoute,
} from '@/routes/admin';
import type { AdminOverviewPageProps } from '@/types';

AdminIndex.layout = {
    breadcrumbs: [{ title: '运营总览', href: '/admin' }],
};

export default function AdminIndex({
    stats,
    recentTutorials,
    recentPosts,
    weeklyTrend,
    canResetDemoData,
}: AdminOverviewPageProps) {
    const { resolvedAppearance } = useAppearance();
    const overviewActions = useAdminOverviewActions();
    const tutorialActions = useAdminTutorialActions();
    const communityActions = useAdminCommunityActions();
    const isDark = resolvedAppearance === 'dark';
    const [resetOpen, setResetOpen] = useState(false);
    const [resetting, setResetting] = useState(false);

    const hasTrendData = weeklyTrend.some(
        (point) =>
            point.tutorials > 0 ||
            point.submissions > 0 ||
            point.communityPosts > 0 ||
            point.reviews > 0,
    );

    const handleResetDemoData = () => {
        setResetting(true);
        overviewActions.resetDemoData({
            onFinish: () => {
                setResetting(false);
                setResetOpen(false);
            },
        });
    };

    return (
        <>
            <Head title="运营总览" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">
                <DashboardPageHeader
                    eyebrow="Operations"
                    title="运营总览"
                    description="总览教程、社区和审核队列，快速进入各个后台模块。"
                    icon={LayoutDashboard}
                    actions={
                        canResetDemoData ? (
                            <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <RotateCcw className="mr-1 h-4 w-4" />
                                        恢复演示数据
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>恢复演示数据</DialogTitle>
                                        <DialogDescription>
                                            将清空当前所有教程和社区帖子，并重新写入
                                            Seeder 演示数据。投稿记录不会被重置。此操作仅在本地开发环境可用。
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setResetOpen(false)}
                                            disabled={resetting}
                                        >
                                            取消
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleResetDemoData}
                                            disabled={resetting}
                                        >
                                            确认恢复
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        ) : null
                    }
                />

                <Card className="border-sidebar-border/70 bg-gradient-to-br from-red-950/10 via-background to-background dark:border-sidebar-border">
                    <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:items-center">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">
                                工作台
                            </p>
                            <h2 className="text-lg font-extrabold tracking-tight text-foreground">
                                先处理审核队列，再回到教程和社区维护
                            </h2>
                            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                这个页面不只是概览，它也应该告诉你今天该做什么。优先清空投稿审核，随后检查最近教程和社区动态，最后再恢复演示数据或进入各模块维护。
                            </p>
                        </div>
                        <WorkQueueCard
                            label="待审投稿"
                            value={stats.pendingSubmissionCount}
                            tone="text-emerald-600 dark:text-emerald-400"
                            description="优先处理，避免审核堆积"
                        />
                        <WorkQueueCard
                            label="精选教程"
                            value={stats.featuredTutorialCount}
                            tone="text-amber-600 dark:text-amber-400"
                            description="检查首页推荐是否合理"
                        />
                        <WorkQueueCard
                            label="社区帖子"
                            value={stats.postCount}
                            tone="text-blue-600 dark:text-blue-400"
                            description="关注热点内容和置顶"
                        />
                    </CardContent>
                </Card>

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <AdminStatCard
                        title="官方教程"
                        value={stats.tutorialCount}
                        note="教程总数"
                        icon={
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        }
                    />
                    <AdminStatCard
                        title="精选教程"
                        value={stats.featuredTutorialCount}
                        note="已标记精选"
                        icon={<Star className="h-4 w-4 text-amber-500" />}
                    />
                    <AdminStatCard
                        title="累计点赞"
                        value={stats.totalLikes}
                        note="社区互动"
                        icon={<Heart className="h-4 w-4 text-red-500" />}
                    />
                    <Link
                        href={adminSubmissions.url({
                            query: { status: 'pending' },
                        })}
                    >
                        <AdminStatCard
                            title="待审投稿"
                            value={stats.pendingSubmissionCount}
                            note="点击查看队列"
                            icon={
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            }
                            className="transition-colors hover:border-red-500/30"
                        />
                    </Link>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-base">
                                运营趋势
                            </CardTitle>
                            <CardDescription>
                                近 7 天新增教程、投稿、社区帖与审核处理量
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {hasTrendData ? (
                                <div className="h-72">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart
                                            data={weeklyTrend}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: -20,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                stroke={
                                                    isDark ? '#1e1e24' : '#e4e4e7'
                                                }
                                            />
                                            <XAxis
                                                dataKey="day"
                                                stroke="#888"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                stroke="#888"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                allowDecimals={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: isDark
                                                        ? '#121214'
                                                        : '#fff',
                                                    borderColor: isDark
                                                        ? '#2d2d34'
                                                        : '#e4e4e7',
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{ fontSize: 12 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="tutorials"
                                                name="新增教程"
                                                stroke="#ef4444"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="submissions"
                                                name="投稿提交"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="communityPosts"
                                                name="社区帖子"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="reviews"
                                                name="审核处理"
                                                stroke="#f59e0b"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <AdminEmptyState
                                    icon={Pin}
                                    title="暂无运营趋势数据"
                                    description="近 7 天还没有新增教程、投稿或社区内容。"
                                />
                            )}
                        </CardContent>
                    </Card>

                    <AdminDetailActionPanel
                        title="后台动作"
                        description="统一入口页动作语气，直接返回教程、查看审核、查看社区。"
                        actions={[
                            {
                                label: '返回教程',
                                onClick: () =>
                                    router.visit(adminTutorialsRoute.url(), {
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
                                        adminSubmissions.url({
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
                                    router.visit(adminCommunity.url(), {
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

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base">
                                    最近教程
                                </CardTitle>
                                <CardDescription>
                                    最新发布到教程库的内容
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={adminTutorialsRoute.url()}>
                                    查看全部
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentTutorials.length > 0 ? (
                                recentTutorials.map((tutorial) => (
                                    <Link
                                        key={tutorial.id}
                                        href={tutorialActions.editUrl(
                                            tutorial.id,
                                        )}
                                        className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold">
                                                    {tutorial.title}
                                                </p>
                                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                    {tutorial.summary}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="shrink-0 text-[10px]"
                                            >
                                                {tutorial.difficulty}
                                            </Badge>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <AdminEmptyState
                                    icon={BookOpen}
                                    title="暂无教程"
                                    description="可以在教程管理中创建第一篇教程。"
                                />
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    最近社区动态
                                </CardTitle>
                                <CardDescription>
                                    需要关注的最新社区内容
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {recentPosts.length > 0 ? (
                                    recentPosts.map((post) => (
                                        <Link
                                            key={post.id}
                                            href={communityActions.detailUrl(
                                                post.id,
                                            )}
                                            className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="flex items-center gap-2">
                                                <p className="truncate text-sm font-semibold">
                                                    {post.title}
                                                </p>
                                                {post.pinned && (
                                                    <Badge className="bg-red-500/10 text-[10px] text-red-600">
                                                        置顶
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {post.author} · 👍 {post.likes}{' '}
                                                · 回复{' '}
                                                {post.answers_count ??
                                                    post.answers.length}
                                            </p>
                                        </Link>
                                    ))
                                ) : (
                                    <AdminEmptyState
                                        icon={ShieldCheck}
                                        title="暂无社区帖子"
                                        description="社区有新内容后会显示在这里。"
                                    />
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-l-2 border-sidebar-border/70 border-l-red-500 dark:border-sidebar-border">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-2">
                                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                                    <div className="space-y-1 text-xs">
                                        <p className="font-semibold">
                                            运营提醒
                                        </p>
                                        <p className="text-muted-foreground">
                                            当前有{' '}
                                            {stats.pendingSubmissionCount}{' '}
                                            篇玩家投稿等待处理，建议优先清空审核队列。
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

function WorkQueueCard({
    label,
    value,
    description,
    tone,
}: {
    label: string;
    value: number;
    description: string;
    tone: string;
}) {
    return (
        <div className="rounded-2xl border border-border bg-card/80 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {label}
            </p>
            <p className={`mt-1 text-2xl font-extrabold ${tone}`}>{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
    );
}
