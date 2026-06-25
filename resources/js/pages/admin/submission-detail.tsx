import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    ArrowLeft,
    Clock,
    ExternalLink,
    Mail,
    ShieldCheck,
    User,
    X,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { AdminDetailActionPanel } from '@/components/admin-detail-action-panel';
import { AdminInfoRow } from '@/components/admin-info-row';
import { AdminInfoTile } from '@/components/admin-info-tile';
import { AdminSubmissionStatusBadge } from '@/components/admin-submission-status-badge';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAdminSubmissionActions } from '@/hooks/use-admin-submission-actions';
import { useAdminTutorialActions } from '@/hooks/use-admin-tutorial-actions';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { getTutorialCategoryLabel } from '@/lib/tutorial-meta';
import { index as adminIndex } from '@/routes/admin';
import { submissions as adminSubmissions } from '@/routes/admin';
import type { AdminSubmissionDetailPageProps } from '@/types';

AdminSubmissionDetail.layout = {
    breadcrumbs: [
        { title: '运营总览', href: adminIndex.url() },
        { title: '投稿审核', href: adminSubmissions.url() },
        { title: '审核详情', href: '#' },
    ],
};

export default function AdminSubmissionDetail({
    submission,
    queueMeta,
}: AdminSubmissionDetailPageProps) {
    const submissionActions = useAdminSubmissionActions();
    const tutorialActions = useAdminTutorialActions();
    const [rejectMode, setRejectMode] = useState(false);
    const [rejectNote, setRejectNote] = useState(submission.review_note ?? '');
    const [processing, setProcessing] = useState(false);
    const { ask, confirmDialog } = useConfirmDialog();

    const canReview = submission.status === 'pending';

    const handleApprove = () => {
        ask({
            title: '通过审核',
            description: '确认通过审核？通过后教程将进入教程库。',
            confirmLabel: '确认通过',
            onConfirm: () =>
                new Promise<void>((resolve) => {
                    setProcessing(true);
                    submissionActions.approve(submission.id, {
                        preserveScroll: true,
                        onFinish: () => setProcessing(false),
                        onSuccess: () => resolve(),
                        onError: () => resolve(),
                    });
                }),
        });
    };

    const handleReject = () => {
        if (!rejectNote.trim()) {
            return;
        }

        setProcessing(true);
        submissionActions.reject(submission.id, rejectNote.trim(), {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title={`审核详情 - ${submission.title}`} />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">
                <DashboardPageHeader
                    eyebrow="Review Detail"
                    title="审核详情"
                    description="集中查看投稿内容、作者信息和审核操作。"
                    icon={ShieldCheck}
                    actions={
                        <Button asChild variant="outline">
                            <Link href={adminSubmissions.url()}>
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                返回审核列表
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
                                        {submission.title}
                                    </CardTitle>
                                    <AdminSubmissionStatusBadge
                                        status={submission.status}
                                    />
                                </div>
                                <CardDescription>
                                    由 {submission.user?.name || '未知用户'} 提交
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {submission.user?.name || '未知用户'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {submission.user?.email || '暂无邮箱'}
                                    </span>
                                    {submission.submitted_at ? (
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(
                                                submission.submitted_at,
                                            ).toLocaleString('zh-CN')}
                                        </span>
                                    ) : null}
                                </div>

                                <div className="grid gap-3 md:grid-cols-3">
                                    <AdminInfoTile
                                        label="分类"
                                        value={
                                            getTutorialCategoryLabel(
                                                submission.details?.category ??
                                                    '',
                                            ) ||
                                            submission.details?.category ||
                                            '-'
                                        }
                                    />
                                    <AdminInfoTile
                                        label="难度"
                                        value={
                                            submission.details?.difficulty ||
                                            '-'
                                        }
                                    />
                                    <AdminInfoTile
                                        label="时长"
                                        value={
                                            submission.details?.duration || '-'
                                        }
                                    />
                                </div>

                                <section className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        内容简介
                                    </h3>
                                    <p className="rounded-xl border bg-muted/20 p-4 text-sm leading-7">
                                        {submission.summary || '暂无简介'}
                                    </p>
                                </section>

                                {submission.cover_image ? (
                                    <section className="space-y-2">
                                        <h3 className="text-sm font-medium">
                                            封面图
                                        </h3>
                                        <img
                                            src={submission.cover_image}
                                            alt="投稿封面"
                                            className="h-56 w-full rounded-xl border object-cover"
                                        />
                                    </section>
                                ) : null}
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    参数配置
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <AdminInfoTile
                                    label="色彩模式"
                                    value={
                                        submission.details?.settings
                                            ?.colorProfile || '-'
                                    }
                                />
                                <AdminInfoTile
                                    label="分辨率"
                                    value={
                                        submission.details?.settings
                                            ?.resolution || '-'
                                    }
                                />
                                <AdminInfoTile
                                    label="云台模式"
                                    value={
                                        submission.details?.settings
                                            ?.gimbalMode || '-'
                                    }
                                />
                                <AdminInfoTile
                                    label="ND 减光镜"
                                    value={
                                        submission.details?.settings
                                            ?.ndFilter || '-'
                                    }
                                />
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    实操步骤
                                </CardTitle>
                                <CardDescription>
                                    共 {submission.details?.steps?.length ?? 0}{' '}
                                    步
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {submission.details?.steps?.length ? (
                                    submission.details.steps.map(
                                        (step, index) => (
                                            <div
                                                key={`${submission.id}-step-${index}`}
                                                className="flex gap-3 rounded-xl border p-3"
                                            >
                                                <div className="text-xs text-muted-foreground">
                                                    {index + 1}.
                                                </div>
                                                <div className="text-sm">
                                                    {step}
                                                </div>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <EmptyText text="暂无步骤内容" />
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    补充技巧
                                </CardTitle>
                                <CardDescription>
                                    共 {submission.details?.tips?.length ?? 0}{' '}
                                    条
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {submission.details?.tips?.length ? (
                                    submission.details.tips.map(
                                        (tip, index) => (
                                            <div
                                                key={`${submission.id}-tip-${index}`}
                                                className="rounded-xl border p-3 text-sm"
                                            >
                                                <span className="mr-2 text-amber-500">
                                                    💡
                                                </span>
                                                {tip}
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <EmptyText text="暂无补充技巧" />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <AdminDetailActionPanel
                            title="后台动作"
                            description={`当前队列 ${queueMeta.pendingCount} 篇待处理，直接通过审核、驳回审核。`}
                            actions={
                                canReview
                                    ? [
                                          {
                                              label: '通过审核',
                                              icon: <CheckCircle2 />,
                                              onClick: handleApprove,
                                              pending: processing,
                                              priority: 0,
                                          },
                                          {
                                              label: '驳回审核',
                                              icon: <XCircle />,
                                              onClick: () => setRejectMode(true),
                                              variant: 'outline',
                                              pending: processing,
                                              priority: 1,
                                          },
                                      ]
                                    : []
                            }
                        >
                            <div className="space-y-4">
                                {canReview ? (
                                    <>
                                        {rejectMode ? (
                                            <div className="space-y-3">
                                                <label
                                                    htmlFor="reject-note"
                                                    className="text-sm font-medium text-muted-foreground"
                                                >
                                                    驳回理由
                                                </label>
                                                <textarea
                                                    id="reject-note"
                                                    value={rejectNote}
                                                    onChange={(e) =>
                                                        setRejectNote(
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={4}
                                                    placeholder="请说明驳回原因，帮助投稿者修改后再投"
                                                    className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm"
                                                />
                                                <div className="grid gap-2">
                                                    <Button
                                                        variant="destructive"
                                                        className="justify-start gap-2"
                                                        onClick={handleReject}
                                                        disabled={
                                                            processing ||
                                                            !rejectNote.trim()
                                                        }
                                                    >
                                                        {processing ? (
                                                            <Spinner className="mr-1 h-4 w-4" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4" />
                                                        )}
                                                        <span>确认驳回</span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="justify-start gap-2 border-border bg-background"
                                                        onClick={() =>
                                                            setRejectMode(false)
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span>取消</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-3 text-xs text-muted-foreground">
                                                先选择通过或驳回，再补充理由并确认提交。
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="rounded-xl border bg-muted/20 p-3 text-sm text-muted-foreground">
                                        该投稿已处理完成，当前不可再次审核。
                                    </div>
                                )}
                            </div>
                        </AdminDetailActionPanel>

                        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    审核记录
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <AdminInfoRow
                                    label="状态"
                                    value={
                                        <AdminSubmissionStatusBadge
                                            status={submission.status}
                                        />
                                    }
                                />
                                <AdminInfoRow
                                    label="审核人"
                                    value={submission.reviewer?.name || '-'}
                                />
                                <AdminInfoRow
                                    label="审核时间"
                                    value={
                                        submission.reviewed_at
                                            ? new Date(
                                                  submission.reviewed_at,
                                              ).toLocaleString('zh-CN')
                                            : '-'
                                    }
                                />
                                <AdminInfoRow
                                    label="驳回备注"
                                    value={submission.review_note || '-'}
                                />
                                <AdminInfoRow
                                    label="已发布教程"
                                    value={
                                        submission.published_tutorial_id ? (
                                            <Link
                                                href={tutorialActions.editUrl(
                                                    submission.published_tutorial_id,
                                                )}
                                                className="inline-flex items-center gap-1 text-red-600 hover:underline"
                                            >
                                                {submission.published_tutorial
                                                    ?.title || '已入教程库'}
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Link>
                                        ) : (
                                            '-'
                                        )
                                    }
                                />
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    队列概览
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <AdminInfoRow
                                    label="待审核"
                                    value={queueMeta.pendingCount}
                                />
                                <AdminInfoRow
                                    label="已通过"
                                    value={queueMeta.approvedCount}
                                />
                                <AdminInfoRow
                                    label="已驳回"
                                    value={queueMeta.rejectedCount}
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

function EmptyText({ text }: { text: string }) {
    return (
        <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            {text}
        </div>
    );
}
