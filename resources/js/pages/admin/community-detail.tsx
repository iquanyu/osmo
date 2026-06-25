import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    MessageSquare,
    Pin,
    Send,
    ShieldAlert,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { AdminDetailActionPanel } from '@/components/admin-detail-action-panel';
import { AdminEmptyState } from '@/components/admin-empty-state';
import { AdminInfoRow } from '@/components/admin-info-row';
import { AdminInfoTile } from '@/components/admin-info-tile';
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
import { Spinner } from '@/components/ui/spinner';
import { useAdminCommunityActions } from '@/hooks/use-admin-community-actions';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { index as adminIndex } from '@/routes/admin';
import { community as adminCommunity } from '@/routes/admin';
import type { AdminCommunityDetailPageProps } from '@/types';

AdminCommunityDetail.layout = {
    breadcrumbs: [
        { title: '运营总览', href: adminIndex.url() },
        { title: '社区管理', href: adminCommunity.url() },
        { title: '帖子详情', href: '#' },
    ],
};

export default function AdminCommunityDetail({
    post,
    stats,
}: AdminCommunityDetailPageProps) {
    const communityActions = useAdminCommunityActions();
    const [replyText, setReplyText] = useState('');
    const [pendingAction, setPendingAction] = useState<
        'pin' | 'delete' | 'reply' | null
    >(null);
    const { ask, confirmDialog } = useConfirmDialog();

    const handleDeletePost = () => {
        ask({
            title: '删除帖子',
            description: '确认删除这篇帖子？删除后无法恢复。',
            confirmLabel: '删除',
            variant: 'destructive',
            onConfirm: () =>
                new Promise<void>((resolve) => {
                    setPendingAction('delete');
                    communityActions.deletePost(post.id, {
                        preserveScroll: true,
                        onFinish: () => setPendingAction(null),
                        onSuccess: () => resolve(),
                        onError: () => resolve(),
                    });
                }),
        });
    };

    const handleTogglePin = () => {
        setPendingAction('pin');
        communityActions.togglePin(post.id, {
            preserveScroll: true,
            onFinish: () => setPendingAction(null),
        });
    };

    const handleReply = () => {
        if (!replyText.trim()) {
            return;
        }

        setPendingAction('reply');
        communityActions.publishOfficialAnswer(post.id, replyText.trim(), {
            preserveScroll: true,
            onSuccess: () => setReplyText(''),
            onFinish: () => setPendingAction(null),
        });
    };

    return (
        <>
            <Head title={`帖子详情 - ${post.title}`} />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">
                <DashboardPageHeader
                    eyebrow="Community"
                    title="帖子详情"
                    description="集中查看帖子正文、回复记录和官方处理动作。"
                    icon={MessageSquare}
                    actions={
                        <Button asChild variant="outline">
                            <Link href={adminCommunity.url()}>
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                返回社区列表
                            </Link>
                        </Button>
                    }
                />

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="space-y-4">
                        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <div className="flex flex-wrap items-center gap-2">
                                    <CardTitle className="text-base">
                                        {post.title}
                                    </CardTitle>
                                    {post.pinned ? (
                                        <Badge className="border border-red-500/20 bg-red-500/10 text-[10px] text-red-600 dark:text-red-400">
                                            <Pin className="mr-0.5 h-2.5 w-2.5 fill-current" />
                                            置顶
                                        </Badge>
                                    ) : null}
                                </div>
                                <CardDescription>
                                    {post.author} ·{' '}
                                    {new Date(post.created_at).toLocaleString(
                                        'zh-CN',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-1.5">
                                    {post.tags.map((currentTag) => (
                                        <Badge
                                            key={currentTag}
                                            variant="outline"
                                            className="text-[10px]"
                                        >
                                            {currentTag}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-sm whitespace-pre-line text-muted-foreground leading-7">
                                    {post.content}
                                </p>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <AdminInfoTile
                                        label="浏览量"
                                        value={post.views || 0}
                                    />
                                    <AdminInfoTile
                                        label="点赞数"
                                        value={post.likes || 0}
                                    />
                                    <AdminInfoTile
                                        label="回复数"
                                        value={
                                            post.answers_count ??
                                            post.answers.length
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    回复记录
                                </CardTitle>
                                <CardDescription>
                                    共 {post.answers.length} 条回复
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {post.answers.length === 0 ? (
                                    <AdminEmptyState
                                        icon={MessageSquare}
                                        title="暂无回复"
                                        description="你可以在右侧直接发布第一条官方回复。"
                                    />
                                ) : (
                                    post.answers.map((answer) => (
                                        <div
                                            key={answer.id}
                                            className={`rounded-xl border p-4 ${
                                                answer.is_official
                                                    ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20'
                                                    : 'border-border'
                                            }`}
                                        >
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <div
                                                    className={`text-xs font-semibold ${
                                                        answer.is_official
                                                            ? 'flex items-center gap-1 text-amber-600 dark:text-amber-400'
                                                            : ''
                                                    }`}
                                                >
                                                    {answer.is_official ? (
                                                        <ShieldAlert className="h-3.5 w-3.5" />
                                                    ) : null}
                                                    {answer.author}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        answer.created_at,
                                                    ).toLocaleString('zh-CN')}
                                                </div>
                                            </div>
                                            <p className="text-sm whitespace-pre-line text-muted-foreground">
                                                {answer.content}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <AdminDetailActionPanel
                            title="后台动作"
                            description="统一后台动作语气，直接返回社区、返回总览。"
                            actions={[
                                {
                                    label: post.pinned ? '取消置顶' : '置顶帖子',
                                    icon: <Pin />,
                                    onClick: handleTogglePin,
                                    pending: pendingAction === 'pin',
                                    priority: 0,
                                },
                                {
                                    label: '删除帖子',
                                    icon: <Trash2 />,
                                    onClick: handleDeletePost,
                                    variant: 'destructive',
                                    pending: pendingAction === 'delete',
                                    priority: 1,
                                },
                            ]}
                        >
                            <div className="space-y-2 border-t pt-3">
                                    <label
                                        htmlFor="official-reply"
                                        className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"
                                    >
                                        <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                                        官方回复
                                    </label>
                                    <textarea
                                        id="official-reply"
                                        value={replyText}
                                        onChange={(e) =>
                                            setReplyText(e.target.value)
                                        }
                                        placeholder="输入官方回复，说明建议或处理结果..."
                                        rows={5}
                                        disabled={pendingAction !== null}
                                        className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm"
                                    />
                                    <Button
                                        className="w-full justify-start gap-2"
                                        disabled={
                                            pendingAction !== null ||
                                            !replyText.trim()
                                        }
                                        onClick={handleReply}
                                    >
                                        {pendingAction === 'reply' ? (
                                            <Spinner className="h-3.5 w-3.5" />
                                        ) : (
                                            <Send className="h-3.5 w-3.5" />
                                        )}
                                        <span>发布官方回复</span>
                                    </Button>
                            </div>
                        </AdminDetailActionPanel>

                        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    社区概览
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <AdminInfoRow
                                    label="帖子总数"
                                    value={stats.postCount}
                                />
                                <AdminInfoRow
                                    label="累计点赞"
                                    value={stats.totalLikes}
                                />
                                <AdminInfoRow
                                    label="累计回复"
                                    value={stats.totalAnswers}
                                />
                                <AdminInfoRow
                                    label="置顶帖"
                                    value={stats.pinnedCount}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            {confirmDialog}
        </>
    );
}
