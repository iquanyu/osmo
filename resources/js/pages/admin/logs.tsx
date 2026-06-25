import { Head, router } from '@inertiajs/react';
import { Activity, Download, Eye, Search, UserRoundSearch, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AdminDetailActionPanel } from '@/components/admin-detail-action-panel';
import { AdminFilterToolbar } from '@/components/admin-filter-toolbar';
import { AdminStatCard } from '@/components/admin-stat-card';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { PaginationLinks } from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { downloadUrl } from '@/lib/download';
import type { PaginatedData } from '@/types';

type ActivityLogItem = {
    id: number;
    action: string;
    message: string;
    subject_type: string | null;
    subject_id: number | null;
    ip_address: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
};

type Props = {
    logs: PaginatedData<ActivityLogItem>;
    stats: {
        currentPageLogs: number;
        uniqueActions: number;
        uniqueUsers: number;
    };
    filters: {
        action: 'all' | string;
        search: string;
        user_id: number | null;
        subject_type: 'all' | string;
        from: string;
        to: string;
    };
};

export default function AdminLogs({ logs, stats, filters }: Props) {
    const search = filters.search;
    const action = filters.action;
    const userId = filters.user_id;
    const subjectType = filters.subject_type;
    const from = filters.from;
    const to = filters.to;
    const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

    const summary = useMemo(() => {
        const operators = new Set<number>();
        const subjectTypes = new Set<string>();

        logs.data.forEach((log) => {
            if (log.user?.id) {
                operators.add(log.user.id);
            }

            if (log.subject_type) {
                subjectTypes.add(log.subject_type);
            }
        });

        return {
            operatorsCount: operators.size,
            subjectTypesCount: subjectTypes.size,
        };
    }, [logs.data]);

    const groupedLogs = useMemo(() => {
        const groups = logs.data.reduce<Record<string, ActivityLogItem[]>>((acc, log) => {
            const module = log.action.split('_')[0] || 'other';
            acc[module] = acc[module] || [];
            acc[module].push(log);

            return acc;
        }, {});

        return Object.entries(groups);
    }, [logs.data]);

    const availableUsers = useMemo(() => {
        const users = new Map<number, NonNullable<ActivityLogItem['user']>>();

        logs.data.forEach((log) => {
            if (log.user) {
                users.set(log.user.id, log.user);
            }
        });

        return Array.from(users.values());
    }, [logs.data]);

    const buildQuery = (overrides: Record<string, string | number | null | undefined>) => {
        const query = new URLSearchParams();

        query.set('search', search);
        query.set('action', action);
        query.set('user_id', userId ? String(userId) : '');
        query.set('subject_type', subjectType);
        query.set('from', from);
        query.set('to', to);

        Object.entries(overrides).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                query.delete(key);

                return;
            }

            query.set(key, String(value));
        });

        return query.toString();
    };

    const visitLogs = (overrides: Record<string, string | number | null | undefined> = {}) => {
        router.visit(`/admin/logs?${buildQuery(overrides)}`, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resolveSubjectLink = (log: ActivityLogItem) => {
        if (!log.subject_type || !log.subject_id) {
            return null;
        }

        if (log.subject_type === 'App\\Models\\User') {
            return `/admin/users?${buildQuery({ user_id: null, subject_type: 'all', action: 'all', search: String(log.subject_id) })}`;
        }

        if (log.subject_type === 'App\\Models\\Tutorial') {
            return `/admin/tutorials?search=${encodeURIComponent(String(log.subject_id))}`;
        }

        if (log.subject_type === 'App\\Models\\CommunityPost') {
            return `/admin/community/${log.subject_id}`;
        }

        if (log.subject_type === 'App\\Models\\Submission') {
            return `/admin/submissions/${log.subject_id}`;
        }

        return null;
    };

    const resolveSubjectLabel = (subjectType: string) => {
        if (subjectType === 'App\\Models\\User') {
            return '用户详情';
        }

        if (subjectType === 'App\\Models\\Tutorial') {
            return '教程管理';
        }

        if (subjectType === 'App\\Models\\CommunityPost') {
            return '社区详情';
        }

        if (subjectType === 'App\\Models\\Submission') {
            return '投稿详情';
        }

        return '关联对象';
    };

    const getActionTone = (actionName: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
        if (actionName.includes('approved') || actionName.includes('created')) {
            return 'default';
        }

        if (actionName.includes('updated') || actionName.includes('enabled')) {
            return 'secondary';
        }

        if (actionName.includes('disabled') || actionName.includes('rejected') || actionName.includes('deleted')) {
            return 'destructive';
        }

        return 'outline';
    };

    const copyText = async (value: string) => {
        await navigator.clipboard.writeText(value);
    };

    const applyFilters = () => {
        visitLogs();
    };

    return (
        <>
            <Head title="日志管理" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">
                <DashboardPageHeader
                    eyebrow="Logs"
                    title="日志管理"
                    description="查看后台操作记录，快速追踪谁在什么时间做了什么，并顺着对象继续追下去。"
                    icon={Activity}
                />

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <AdminStatCard title="当前页日志" value={stats.currentPageLogs} />
                    <AdminStatCard title="操作人" value={stats.uniqueUsers} />
                    <AdminStatCard title="操作类型" value={stats.uniqueActions} />
                </div>

                <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                    当前页可追踪 {summary.subjectTypesCount} 类对象，支持按用户、动作、对象和时间继续筛选。
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-base">操作日志</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AdminFilterToolbar
                                filters={
                                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
                                        <div className="relative">
                                            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                value={search}
                                                onChange={(e) =>
                                                    visitLogs({ search: e.target.value })
                                                }
                                                placeholder="搜索日志消息或操作人..."
                                                className="h-9 pl-9 text-sm"
                                            />
                                        </div>
                                        <Select
                                            value={action}
                                            onValueChange={(value) =>
                                                visitLogs({ action: value })
                                            }
                                        >
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue placeholder="全部操作" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">全部操作</SelectItem>
                                                <SelectItem value="user_role_updated">角色更新</SelectItem>
                                                <SelectItem value="tutorial_created">教程创建</SelectItem>
                                                <SelectItem value="tutorial_updated">教程更新</SelectItem>
                                                <SelectItem value="community_post_deleted">社区删除</SelectItem>
                                                <SelectItem value="submission_approved">投稿通过</SelectItem>
                                                <SelectItem value="submission_rejected">投稿驳回</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={userId ? String(userId) : ''}
                                            onValueChange={(value) =>
                                                visitLogs({ user_id: value })
                                            }
                                        >
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue placeholder="全部操作人" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">全部操作人</SelectItem>
                                                {availableUsers.map((user) => (
                                                    <SelectItem key={user.id} value={String(user.id)}>
                                                        {user.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={subjectType}
                                            onValueChange={(value) =>
                                                visitLogs({ subject_type: value })
                                            }
                                        >
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue placeholder="全部对象" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">全部对象</SelectItem>
                                                <SelectItem value="App\\Models\\User">用户</SelectItem>
                                                <SelectItem value="App\\Models\\Tutorial">教程</SelectItem>
                                                <SelectItem value="App\\Models\\CommunityPost">社区帖子</SelectItem>
                                                <SelectItem value="App\\Models\\Submission">投稿</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                type="date"
                                                value={from}
                                                onChange={(e) =>
                                                    visitLogs({ from: e.target.value })
                                                }
                                                className="h-9 text-sm"
                                            />
                                            <Input
                                                type="date"
                                                value={to}
                                                onChange={(e) =>
                                                    visitLogs({ to: e.target.value })
                                                }
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                    </div>
                                }
                                onReset={() =>
                                    router.visit('/admin/logs', {
                                        preserveScroll: true,
                                        preserveState: true,
                                        replace: true,
                                    })
                                }
                                onApply={applyFilters}
                            />

                            <div className="space-y-3">
                                {logs.data.map((log) => (
                                    <div key={log.id} className="rounded-xl border border-border p-4">
                                        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-sm font-semibold">{log.message}</p>
                                                    <Badge variant={getActionTone(log.action)} className="text-[10px]">
                                                        {log.action}
                                                    </Badge>
                                                    {log.subject_type ? (
                                                        <Badge variant="secondary" className="text-[10px]">
                                                            {log.subject_type}
                                                            {log.subject_id ? `#${log.subject_id}` : ''}
                                                        </Badge>
                                                    ) : null}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {log.user?.name || '系统'} · {log.created_at} · {log.ip_address || '-'}
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => setSelectedLog(log)}>
                                                <Eye className="mr-1 h-3.5 w-3.5" />
                                                详情
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">按模块分组</p>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {groupedLogs.map(([module, moduleLogs]) => (
                                        <div key={module} className="rounded-xl border border-border p-3">
                                            <div className="mb-2 flex items-center justify-between">
                                                <p className="text-sm font-semibold">{module}</p>
                                                <Badge variant="outline" className="text-[10px]">{moduleLogs.length}</Badge>
                                            </div>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                {moduleLogs.slice(0, 3).map((log) => (
                                                    <p key={log.id} className="truncate">{log.message}</p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">对象快捷筛选</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: '全部对象', value: 'all' },
                                        { label: '用户', value: 'App\\Models\\User' },
                                        { label: '教程', value: 'App\\Models\\Tutorial' },
                                        { label: '社区帖子', value: 'App\\Models\\CommunityPost' },
                                        { label: '投稿', value: 'App\\Models\\Submission' },
                                    ].map((item) => (
                                        <Button
                                            key={item.value}
                                            size="sm"
                                            variant={subjectType === item.value ? 'default' : 'outline'}
                                            onClick={() => visitLogs({ subject_type: item.value })}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <PaginationLinks pagination={logs} />
                        </CardContent>
                    </Card>

                    <AdminDetailActionPanel
                        title="后台动作"
                        description="统一后台动作语气，直接返回总览、查看用户管理、导出日志。"
                        actions={[
                            {
                                label: '返回总览',
                                onClick: () =>
                                    router.visit('/admin', {
                                        preserveScroll: true,
                                        preserveState: true,
                                        replace: true,
                                    }),
                                variant: 'default',
                                priority: 0,
                            },
                            {
                                label: '查看用户管理',
                                onClick: () =>
                                    router.visit('/admin/users', {
                                        preserveScroll: true,
                                        preserveState: true,
                                        replace: true,
                                    }),
                                variant: 'default',
                                priority: 1,
                            },
                            {
                                label: '导出日志',
                                onClick: () =>
                                    downloadUrl(`/admin/logs/export?${buildQuery({ subject_type: null })}`),
                                variant: 'outline',
                                icon: <Download />,
                                priority: 2,
                            },
                        ]}
                        children={
                            <div className="space-y-3 border-t border-border pt-3">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    快速筛选
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: '全部', value: 'all' },
                                        { label: '角色更新', value: 'user_role_updated' },
                                        { label: '教程创建', value: 'tutorial_created' },
                                        { label: '投稿审核', value: 'submission_approved' },
                                    ].map((item) => (
                                        <Button
                                            key={item.value}
                                            variant={action === item.value ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() =>
                                                visitLogs({ action: item.value })
                                            }
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        }
                    />
                </div>
            </div>
            <Dialog open={selectedLog !== null} onOpenChange={(open) => !open && setSelectedLog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>日志详情</DialogTitle>
                        <DialogDescription>查看完整日志上下文。</DialogDescription>
                    </DialogHeader>
                    {selectedLog ? (
                        <div className="space-y-4 text-sm">
                            <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-4">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    摘要
                                </p>
                                <p className="font-medium leading-6">{selectedLog.message}</p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={getActionTone(selectedLog.action)} className="text-[10px]">
                                        {selectedLog.action}
                                    </Badge>
                                    {selectedLog.subject_type ? (
                                        <Badge variant="secondary" className="text-[10px]">
                                            {selectedLog.subject_type}
                                            {selectedLog.subject_id ? `#${selectedLog.subject_id}` : ''}
                                        </Badge>
                                    ) : null}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    上下文
                                </p>
                                <div className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <p>时间：{selectedLog.created_at}</p>
                                        <p>操作人：{selectedLog.user?.name || '系统'}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p>对象：{selectedLog.subject_type ? `${selectedLog.subject_type}#${selectedLog.subject_id ?? '-'}` : '-'}</p>
                                        <p>IP：{selectedLog.ip_address || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <Collapsible>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        原始数据
                                    </p>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            展开 / 收起
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="mt-3">
                                    <pre className="max-h-64 overflow-auto rounded-xl bg-muted p-3 text-xs">
                                        {JSON.stringify(selectedLog, null, 2)}
                                    </pre>
                                </CollapsibleContent>
                            </Collapsible>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    追踪与导出
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedLog.user ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                visitLogs({
                                                    user_id: selectedLog.user?.id ?? null,
                                                })
                                            }
                                        >
                                            <UserRoundSearch className="mr-1 h-3.5 w-3.5" />
                                            仅看该操作人
                                        </Button>
                                    ) : null}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyText(selectedLog.action)}
                                    >
                                        复制操作名
                                    </Button>
                                    {selectedLog.subject_type ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                copyText(
                                                    `${selectedLog.subject_type}#${selectedLog.subject_id ?? '-'}`,
                                                )
                                            }
                                        >
                                            复制对象标识
                                        </Button>
                                    ) : null}
                                    {selectedLog.subject_type ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const subjectLink = resolveSubjectLink(selectedLog);

                                                if (subjectLink) {
                                                    router.visit(subjectLink, {
                                                        preserveScroll: true,
                                                        preserveState: true,
                                                        replace: true,
                                                    });

                                                    return;
                                                }

                                                visitLogs({ subject_type: selectedLog.subject_type });
                                            }}
                                        >
                                            <Filter className="mr-1 h-3.5 w-3.5" />
                                            查看{resolveSubjectLabel(selectedLog.subject_type)}
                                        </Button>
                                    ) : null}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            downloadUrl(
                                                `/admin/logs/export?${buildQuery({ subject_type: null })}`,
                                            )
                                        }
                                    >
                                        <Download className="mr-1 h-3.5 w-3.5" />
                                        导出当前条件
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
}
