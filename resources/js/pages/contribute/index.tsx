import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    Edit2,
    Eye,
    Loader2,
    Plus,
    Send,
    Trash2,
    X,
    PenLine,
} from 'lucide-react';
import { useState } from 'react';
import { CoverImageField } from '@/components/cover-image-field';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import InputError from '@/components/input-error';
import { SubmissionStatusBadge } from '@/components/submission-status-badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import {
    isSubmissionPendingReview,
} from '@/lib/submission-status';
import {
    tutorialCategoryOptions,
    tutorialDifficultyOptions,
} from '@/lib/tutorial-meta';
import {
    destroy as destroySubmissionRoute,
    index as contributeRoute,
    store as storeSubmissionRoute,
    submit as submitSubmissionRoute,
    update as updateSubmissionRoute,
} from '@/routes/contribute';
import type { Submission, SubmissionStatus } from '@/types';

type SubmissionFormErrors = Partial<
    Record<
        | 'title'
        | 'summary'
        | 'category'
        | 'difficulty'
        | 'duration'
        | 'steps'
        | 'steps.0'
        | 'tips'
        | 'tips.0'
        | 'settings.resolution'
        | 'settings.colorProfile'
        | 'settings.gimbalMode'
        | 'settings.ndFilter'
        | 'cover_image'
        | 'cover_image_url',
        string
    >
>;

interface Props {
    submissions: Submission[];
    stats: {
        draft: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    filters: {
        status: 'all' | SubmissionStatus;
    };
}

ContributeIndex.layout = {
    breadcrumbs: [{ title: '投稿中心', href: contributeRoute.url() }],
};

export default function ContributeIndex({ submissions, stats, filters }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSubmission, setEditingSubmission] =
        useState<Partial<Submission> | null>(null);
    const [loading, setLoading] = useState(false);

    // 表单字段
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [category, setCategory] = useState('beginner');
    const [difficulty, setDifficulty] = useState('新手');
    const [duration, setDuration] = useState('5 分钟');
    const [coverImage, setCoverImage] = useState(
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    );
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [settings, setSettings] = useState({
        resolution: '4K 30fps',
        colorProfile: 'D-Log M (10-bit)',
        gimbalMode: '跟随 (Follow)',
        ndFilter: '无',
    });
    const [stepInput, setStepInput] = useState('');
    const [stepsList, setStepsList] = useState<string[]>([]);
    const [tipInput, setTipInput] = useState('');
    const [tipsList, setTipsList] = useState<string[]>([]);
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    const [errors, setErrors] = useState<SubmissionFormErrors>({});
    const [initialSnapshot, setInitialSnapshot] = useState('');
    const { ask, confirmDialog } = useConfirmDialog();

    const buildFormSnapshot = (
        nextCoverImageFile: File | null = coverImageFile,
    ): string =>
        JSON.stringify({
            title,
            summary,
            category,
            difficulty,
            duration,
            coverImage,
            coverImageFile: nextCoverImageFile
                ? {
                      name: nextCoverImageFile.name,
                      size: nextCoverImageFile.size,
                      lastModified: nextCoverImageFile.lastModified,
                  }
                : null,
            settings,
            stepsList,
            tipsList,
        });

    const clearError = (key: keyof SubmissionFormErrors) => {
        setErrors((current) => {
            if (!current[key]) {
                return current;
            }

            const next = { ...current };
            delete next[key];

            return next;
        });
    };

    const resetForm = () => {
        setTitle('');
        setSummary('');
        setCategory('beginner');
        setDifficulty('新手');
        setDuration('5 分钟');
        setCoverImage(
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
        );
        setCoverImageFile(null);
        setSettings({
            resolution: '4K 30fps',
            colorProfile: 'D-Log M (10-bit)',
            gimbalMode: '跟随 (Follow)',
            ndFilter: '无',
        });
        setStepInput('');
        setStepsList([]);
        setTipInput('');
        setTipsList([]);
        setErrors({});
    };

    const closeEditor = () => {
        setIsDialogOpen(false);
        setEditingSubmission(null);
        setErrors({});
        setInitialSnapshot('');
    };

    const openCreate = () => {
        resetForm();
        setEditingSubmission(null);
        setInitialSnapshot(
            JSON.stringify({
                title: '',
                summary: '',
                category: 'beginner',
                difficulty: '新手',
                duration: '5 分钟',
                coverImage:
                    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
                coverImageFile: null,
                settings: {
                    resolution: '4K 30fps',
                    colorProfile: 'D-Log M (10-bit)',
                    gimbalMode: '跟随 (Follow)',
                    ndFilter: '无',
                },
                stepsList: [],
                tipsList: [],
            }),
        );
        setIsDialogOpen(true);
    };

    const openEdit = (sub: Submission) => {
        const nextSettings =
            sub.details?.settings || {
                resolution: '4K 30fps',
                colorProfile: 'D-Log M (10-bit)',
                gimbalMode: '跟随 (Follow)',
                ndFilter: '无',
            };
        const nextSteps = sub.details?.steps || [];
        const nextTips = sub.details?.tips || [];
        const nextCoverImage = sub.cover_image || '';

        setTitle(sub.title);
        setSummary(sub.summary || '');
        setCategory(sub.details?.category || 'beginner');
        setDifficulty(sub.details?.difficulty || '新手');
        setDuration(sub.details?.duration || '5 分钟');
        setCoverImage(nextCoverImage);
        setCoverImageFile(null);
        setSettings(nextSettings);
        setStepsList(nextSteps);
        setTipsList(nextTips);
        setStepInput('');
        setTipInput('');
        setErrors({});
        setInitialSnapshot(
            JSON.stringify({
                title: sub.title,
                summary: sub.summary || '',
                category: sub.details?.category || 'beginner',
                difficulty: sub.details?.difficulty || '新手',
                duration: sub.details?.duration || '5 分钟',
                coverImage: nextCoverImage,
                coverImageFile: null,
                settings: nextSettings,
                stepsList: nextSteps,
                tipsList: nextTips,
            }),
        );
        setEditingSubmission(sub);
        setIsDialogOpen(true);
    };

    const requestCloseEditor = () => {
        if (loading) {
            return;
        }

        if (buildFormSnapshot() === initialSnapshot) {
            closeEditor();

            return;
        }

        ask({
            title: '放弃未保存修改',
            description: '当前表单还有未保存内容，确认要关闭编辑器吗？',
            confirmLabel: '放弃修改',
            onConfirm: () => closeEditor(),
        });
    };

    const addStep = () => {
        if (stepInput.trim()) {
            setStepsList([...stepsList, stepInput.trim()]);
            setStepInput('');
            clearError('steps');
            clearError('steps.0');
        }
    };

    const removeStep = (index: number) => {
        setStepsList(stepsList.filter((_, i) => i !== index));
    };

    const addTip = () => {
        if (tipInput.trim()) {
            setTipsList([...tipsList, tipInput.trim()]);
            setTipInput('');
            clearError('tips');
            clearError('tips.0');
        }
    };

    const removeTip = (index: number) => {
        setTipsList(tipsList.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!title.trim() || !summary.trim()) {
            return;
        }

        setLoading(true);

        const payload = {
            title,
            summary,
            category,
            difficulty,
            duration,
            steps: stepsList,
            tips: tipsList,
            settings,
            cover_image: coverImageFile,
            cover_image_url: coverImageFile ? '' : coverImage,
        };

        const requestOptions = {
            preserveScroll: true,
            forceFormData: Boolean(coverImageFile),
            onSuccess: () => {
                setErrors({});
                closeEditor();

                if (!editingSubmission?.id) {
                    resetForm();
                }
            },
            onError: (nextErrors: Record<string, string>) => {
                setErrors(nextErrors as SubmissionFormErrors);
            },
            onFinish: () => setLoading(false),
        };

        if (editingSubmission?.id) {
            router.put(
                updateSubmissionRoute.url(editingSubmission.id),
                payload,
                requestOptions,
            );
        } else {
            router.post(storeSubmissionRoute.url(), payload, requestOptions);
        }
    };

    const handleSubmitForReview = (sub: Submission) => {
        ask({
            title: '提交审核',
            description: '提交后将进入运营审核队列，审核前仍可查看和修改草稿。',
            confirmLabel: '确认提交',
            onConfirm: () =>
                new Promise<void>((resolve) => {
                    setPendingAction(`submit:${sub.id}`);
                    router.post(
                        submitSubmissionRoute.url(sub.id),
                        {},
                        {
                            preserveScroll: true,
                            onSuccess: () => resolve(),
                            onError: () => resolve(),
                            onFinish: () => setPendingAction(null),
                        },
                    );
                }),
        });
    };

    const handleDelete = (subId: number) => {
        ask({
            title: '删除投稿',
            description: '确定要删除这篇投稿吗？此操作不可撤销。',
            confirmLabel: '删除',
            variant: 'destructive',
            onConfirm: () =>
                new Promise<void>((resolve) => {
                    setPendingAction(`delete:${subId}`);
                    router.delete(destroySubmissionRoute.url(subId), {
                        preserveScroll: true,
                        onSuccess: () => resolve(),
                        onError: () => resolve(),
                        onFinish: () => setPendingAction(null),
                    });
                }),
        });
    };

    const statusBadge = (status: SubmissionStatus) => (
        <SubmissionStatusBadge status={status} mode="contribute" />
    );

    const getSubmissionNextStep = (status: SubmissionStatus) => {
        if (status === 'draft') {
            return '可以继续编辑，或直接提交审核';
        }

        if (status === 'pending') {
            return '正在等待运营审核，先不用重复提交';
        }

        if (status === 'approved') {
            return '已入库，可以作为参考继续创作';
        }

        return '先根据驳回理由修改，再重新提交';
    };

    const statusFilters: Array<{
        key: 'all' | SubmissionStatus;
        label: string;
        count: number;
    }> = [
        {
            key: 'all',
            label: '全部',
            count: stats.draft + stats.pending + stats.approved + stats.rejected,
        },
        { key: 'draft', label: '草稿', count: stats.draft },
        { key: 'pending', label: '审核中', count: stats.pending },
        { key: 'approved', label: '已通过', count: stats.approved },
        { key: 'rejected', label: '已驳回', count: stats.rejected },
    ];

    const isEditing = Boolean(editingSubmission?.id);
    const canSave = !loading && title.trim() !== '' && summary.trim() !== '';
    const draftSummary = [
        `${stepsList.length} 个步骤`,
        `${tipsList.length} 条技巧`,
        coverImageFile || coverImage ? '已配封面' : '待补封面',
    ];

    return (
        <>
            <Head title="投稿中心" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">
                <DashboardPageHeader
                    eyebrow="Creator Center"
                    title="玩家投稿"
                    description="管理教程草稿、跟踪审核进度，把你的 Pocket 3 经验分享给更多创作者。"
                    icon={PenLine}
                    actions={
                        <Button onClick={openCreate} size="sm">
                            <Plus className="mr-1 size-4" />
                            新建教程投稿
                        </Button>
                    }
                />
                <Card className="border-sidebar-border/70 bg-gradient-to-br from-red-950/10 via-background to-background dark:border-sidebar-border">
                    <CardContent className="grid gap-4 p-4 md:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,1fr))] md:items-center">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">
                                投稿工作流
                            </p>
                            <h2 className="text-base font-extrabold tracking-tight text-foreground">
                                先存草稿，再提交审核，驳回后直接回到修改
                            </h2>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                这里把草稿、审核中、已通过、已驳回四种状态放在同一页里，方便你判断现在该编辑、等待还是重投。
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border bg-card/80 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                当前草稿
                            </p>
                            <p className="mt-1 text-2xl font-extrabold text-foreground">
                                {stats.draft}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                草稿可随时编辑和提交审核。
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border bg-card/80 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                待处理
                            </p>
                            <p className="mt-1 text-2xl font-extrabold text-amber-500">
                                {stats.pending}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                审核中的稿件不需要重复提交。
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                草稿
                            </CardTitle>
                            <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.draft}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                审核中
                            </CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.pending}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                已通过
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.approved}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                已驳回
                            </CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.rejected}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action bar + list */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">我的投稿</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {statusFilters.map((filter) => {
                            const isActive = filters.status === filter.key;

                            return (
                                <Link
                                    key={filter.key}
                                    href={contributeRoute.url(
                                        filter.key === 'all'
                                            ? undefined
                                            : { query: { status: filter.key } },
                                    )}
                                    preserveScroll
                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                        isActive
                                            ? 'border-red-500/40 bg-red-950/15 text-red-500'
                                            : 'border-border bg-background text-muted-foreground hover:border-red-500/30 hover:text-foreground'
                                    }`}
                                >
                                    <span>{filter.label}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                                            isActive
                                                ? 'bg-red-500/10 text-red-500'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {filter.count}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {submissions.length === 0 ? (
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Edit2 className="mb-3 h-10 w-10 opacity-40" />
                            <p className="text-sm">还没有投稿</p>
                            <p className="mt-1 text-xs">
                                点击「新建教程投稿」开始创作
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {submissions.map((sub) => (
                            <Card
                                key={sub.id}
                                className="overflow-hidden border-sidebar-border/70 dark:border-sidebar-border"
                            >
                                <CardContent className="p-4">
                                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="mt-0.5">
                                                {statusBadge(sub.status)}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm font-semibold">
                                                    {sub.title}
                                                </h3>
                                                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                                    {sub.summary}
                                                </p>
                                                <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(
                                                            sub.created_at,
                                                        ).toLocaleDateString(
                                                            'zh-CN',
                                                        )}
                                                    </span>
                                                    {sub.details && (
                                                        <>
                                                            <span>
                                                                {
                                                                    sub.details
                                                                        .difficulty
                                                                }
                                                            </span>
                                                            <span>
                                                                {
                                                                    sub.details
                                                                        .duration
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                {sub.status === 'rejected' &&
                                                    sub.review_note && (
                                                        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs dark:border-red-900 dark:bg-red-950/30">
                                                            <span className="font-semibold text-red-600 dark:text-red-400">
                                                                驳回理由：
                                                            </span>
                                                            <span className="ml-1 text-red-700 dark:text-red-300">
                                                                {
                                                                    sub.review_note
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:max-w-[360px]">
                                            {sub.status === 'draft' && (
                                                <>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() =>
                                                            openEdit(sub)
                                                        }
                                                        className="px-3"
                                                    >
                                                        <Edit2 className="mr-1 h-3.5 w-3.5" />
                                                        编辑
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        disabled={
                                                            pendingAction ===
                                                            `submit:${sub.id}`
                                                        }
                                                        onClick={() =>
                                                            handleSubmitForReview(
                                                                sub,
                                                            )
                                                        }
                                                        className="px-3"
                                                    >
                                                        {pendingAction ===
                                                        `submit:${sub.id}` ? (
                                                            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <Send className="mr-1 h-3.5 w-3.5" />
                                                        )}
                                                        提交审核
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={
                                                            pendingAction ===
                                                            `delete:${sub.id}`
                                                        }
                                                        onClick={() =>
                                                            handleDelete(sub.id)
                                                        }
                                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:hover:bg-red-950/30"
                                                    >
                                                        {pendingAction === `delete:${sub.id}` ? (
                                                            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                                                        )}
                                                        删除
                                                    </Button>
                                                </>
                                            )}
                                            {sub.status === 'rejected' && (
                                                <>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() =>
                                                            openEdit(sub)
                                                        }
                                                        className="px-3"
                                                    >
                                                        <Edit2 className="mr-1 h-3.5 w-3.5" />
                                                        修改
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        disabled={
                                                            pendingAction ===
                                                            `submit:${sub.id}`
                                                        }
                                                        onClick={() =>
                                                            handleSubmitForReview(
                                                                sub,
                                                            )
                                                        }
                                                        className="px-3"
                                                    >
                                                        {pendingAction ===
                                                        `submit:${sub.id}` ? (
                                                            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <Send className="mr-1 h-3.5 w-3.5" />
                                                        )}
                                                        提交审核
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={
                                                            pendingAction ===
                                                            `delete:${sub.id}`
                                                        }
                                                        onClick={() =>
                                                            handleDelete(sub.id)
                                                        }
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                                                    >
                                                        {pendingAction ===
                                                        `delete:${sub.id}` ? (
                                                            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                                                        )}
                                                        删除
                                                    </Button>
                                                </>
                                            )}
                                            {isSubmissionPendingReview(sub.status) && (
                                                <div className="space-y-1 text-xs text-amber-600 dark:text-amber-400">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        等待运营审核...
                                                    </span>
                                                    <span className="block text-muted-foreground">
                                                        {getSubmissionNextStep(
                                                            sub.status,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {sub.status === 'approved' && (
                                                <div className="space-y-1 text-xs text-emerald-600 dark:text-emerald-400">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3.5 w-3.5" />
                                                        已入库教程库
                                                    </span>
                                                    <span className="block text-muted-foreground">
                                                        {getSubmissionNextStep(
                                                            sub.status,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {sub.status === 'draft' && (
                                                <div className="space-y-1 text-xs text-muted-foreground">
                                                    <span className="block">
                                                        {getSubmissionNextStep(
                                                            sub.status,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {sub.status === 'rejected' && (
                                                <div className="space-y-1 text-xs text-muted-foreground">
                                                    <span className="block">
                                                        {getSubmissionNextStep(
                                                            sub.status,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => !open && requestCloseEditor()}
            >
                <DialogContent className="flex max-h-[92vh] max-w-4xl flex-col gap-0 overflow-hidden p-0">
                    <DialogHeader className="border-b px-6 py-5">
                        <div className="pr-8">
                            <DialogTitle className="text-base">
                                {isEditing ? '编辑教程投稿' : '新建教程投稿'}
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-xs">
                                {isEditing
                                    ? '修改草稿内容后可重新提交审核，先把标题、步骤和关键参数补完整。'
                                    : '先保存草稿，再回头补参数、步骤和技巧，确认后再提交审核。'}
                            </DialogDescription>
                        </div>
                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                            {draftSummary.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </DialogHeader>

                    <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                        <section className="space-y-4 rounded-2xl border border-border bg-card/70 p-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">
                                    基本信息
                                </p>
                                <h3 className="text-sm font-semibold text-foreground">
                                    先把这篇投稿说清楚
                                </h3>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">
                                    教程标题
                                </label>
                                <Input
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        clearError('title');
                                    }}
                                    placeholder="例：正午沙滩强光高反差视频直出参数"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">
                                    核心简介
                                </label>
                                <textarea
                                    value={summary}
                                    onChange={(e) => {
                                        setSummary(e.target.value);
                                        clearError('summary');
                                    }}
                                    placeholder="说明这篇教程解决什么问题，适合什么场景，最后能拍出什么效果..."
                                    rows={4}
                                    className="w-full resize-none rounded-md border border-border bg-background p-2.5 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                                />
                                <InputError message={errors.summary} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">
                                        分类
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => {
                                            setCategory(e.target.value);
                                            clearError('category');
                                        }}
                                        className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                                    >
                                        {tutorialCategoryOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">
                                        难度
                                    </label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => {
                                            setDifficulty(e.target.value);
                                            clearError('difficulty');
                                        }}
                                        className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                                    >
                                        {tutorialDifficultyOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.difficulty} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">
                                        预计时长
                                    </label>
                                    <Input
                                        value={duration}
                                        onChange={(e) => {
                                            setDuration(e.target.value);
                                            clearError('duration');
                                        }}
                                        placeholder="5 分钟"
                                    />
                                    <InputError message={errors.duration} />
                                </div>
                            </div>

                            <CoverImageField
                                url={coverImage}
                                file={coverImageFile}
                                onUrlChange={(url) => {
                                    setCoverImage(url);
                                    clearError('cover_image_url');
                                }}
                                onFileChange={(file) => {
                                    setCoverImageFile(file);
                                    clearError('cover_image');
                                    clearError('cover_image_url');
                                }}
                                urlError={errors.cover_image_url}
                                fileError={errors.cover_image}
                                previewAlt={title || '投稿封面预览'}
                            />
                        </section>

                        <section className="space-y-4 rounded-2xl border border-border bg-card/70 p-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">
                                    参数信息
                                </p>
                                <h3 className="text-sm font-semibold text-foreground">
                                    把 Pocket 3 关键设置补完整
                                </h3>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">
                                        色彩模式
                                    </label>
                                    <Input
                                        value={settings.colorProfile}
                                        onChange={(e) => {
                                            setSettings({
                                                ...settings,
                                                colorProfile: e.target.value,
                                            });
                                            clearError('settings.colorProfile');
                                        }}
                                    />
                                    <InputError message={errors['settings.colorProfile']} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">
                                        分辨率
                                    </label>
                                    <Input
                                        value={settings.resolution}
                                        onChange={(e) => {
                                            setSettings({
                                                ...settings,
                                                resolution: e.target.value,
                                            });
                                            clearError('settings.resolution');
                                        }}
                                    />
                                    <InputError message={errors['settings.resolution']} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">
                                        云台模式
                                    </label>
                                    <Input
                                        value={settings.gimbalMode}
                                        onChange={(e) => {
                                            setSettings({
                                                ...settings,
                                                gimbalMode: e.target.value,
                                            });
                                            clearError('settings.gimbalMode');
                                        }}
                                    />
                                    <InputError message={errors['settings.gimbalMode']} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">
                                        ND 减光镜
                                    </label>
                                    <Input
                                        value={settings.ndFilter}
                                        onChange={(e) => {
                                            setSettings({
                                                ...settings,
                                                ndFilter: e.target.value,
                                            });
                                            clearError('settings.ndFilter');
                                        }}
                                    />
                                    <InputError message={errors['settings.ndFilter']} />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4 rounded-2xl border border-border bg-card/70 p-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">
                                    实操内容
                                </p>
                                <h3 className="text-sm font-semibold text-foreground">
                                    步骤和技巧越清楚，越容易通过审核
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    实操步骤（{stepsList.length} 步）
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        value={stepInput}
                                        onChange={(e) => setStepInput(e.target.value)}
                                        placeholder="例：将机身开机，右滑屏幕切到 D-Log M"
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' &&
                                            (e.preventDefault(), addStep())
                                        }
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addStep}
                                    >
                                        添加
                                    </Button>
                                </div>
                                {stepsList.length > 0 ? (
                                    <div className="max-h-48 space-y-1.5 overflow-y-auto">
                                        {stepsList.map((step, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm"
                                            >
                                                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                                                    {idx + 1}.
                                                </span>
                                                <span className="flex-1 truncate">
                                                    {step}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 shrink-0"
                                                    onClick={() => removeStep(idx)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        先写出最关键的 3 到 5 步，审核会更快判断内容质量。
                                    </p>
                                )}
                                <InputError message={errors.steps || errors['steps.0']} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    实用技巧（{tipsList.length} 条）
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        value={tipInput}
                                        onChange={(e) => setTipInput(e.target.value)}
                                        placeholder="例：正午光照反差大，建议锁定脸部测光"
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' &&
                                            (e.preventDefault(), addTip())
                                        }
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addTip}
                                    >
                                        添加
                                    </Button>
                                </div>
                                {tipsList.length > 0 ? (
                                    <div className="max-h-40 space-y-1.5 overflow-y-auto">
                                        {tipsList.map((tip, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm"
                                            >
                                                <span className="shrink-0 text-amber-500">
                                                    提示
                                                </span>
                                                <span className="flex-1 truncate">
                                                    {tip}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 shrink-0"
                                                    onClick={() => removeTip(idx)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        可以补充避坑点、补光建议或常见误区，让内容更像一篇完整教程。
                                    </p>
                                )}
                                <InputError message={errors.tips || errors['tips.0']} />
                            </div>
                        </section>
                    </div>

                    <DialogFooter className="border-t px-6 py-4 sm:justify-between">
                        <p className="text-xs text-muted-foreground">
                            {isEditing
                                ? '更新后仍保存为草稿，确认无误后再提交审核。'
                                : '保存后会先进入草稿箱，你可以稍后继续补充。'}
                        </p>
                        <div className="flex flex-col-reverse gap-2 sm:flex-row">
                            <Button
                                variant="outline"
                                onClick={requestCloseEditor}
                            >
                                取消
                            </Button>
                            <Button onClick={handleSave} disabled={!canSave}>
                                {loading ? (
                                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                ) : null}
                                {isEditing ? '更新草稿' : '保存草稿'}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {confirmDialog}
        </>
    );
}
