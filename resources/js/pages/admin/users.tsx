import { Head, router } from '@inertiajs/react';
import { Eye, FileText, Search, ShieldCheck, ShieldOff, Users, KeyRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AdminDetailActionPanel } from '@/components/admin-detail-action-panel';
import { AdminFilterToolbar } from '@/components/admin-filter-toolbar';
import { AdminStatCard } from '@/components/admin-stat-card';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { PaginationLinks } from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { index as adminIndex } from '@/routes/admin';
import type { PaginatedData } from '@/types';

type AdminUserItem = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'player';
    login_disabled_at: string | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    users: PaginatedData<AdminUserItem>;
    recentLogsByUser: Record<number, Array<{
        id: number;
        action: string;
        message: string;
        created_at: string;
    }>>;
    filters: {
        role: 'all' | 'admin' | 'player';
        search: string;
    };
};

type UserLogItem = {
    id: number;
    action: string;
    message: string;
    created_at: string;
};

export default function AdminUsers({ users, recentLogsByUser, filters }: Props) {
    const search = filters.search;
    const role = filters.role;
    const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);

    const summary = useMemo(() => {
        const disabledCount = users.data.filter((user) => user.login_disabled_at !== null).length;
        const adminCount = users.data.filter((user) => user.role === 'admin').length;
        const playerCount = users.data.filter((user) => user.role === 'player').length;

        return {
            disabledCount,
            adminCount,
            playerCount,
        };
    }, [users.data]);

    const buildQuery = (overrides: Record<string, string | number | null | undefined>) => {
        const query = new URLSearchParams();

        query.set('search', search);
        query.set('role', role);

        Object.entries(overrides).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                query.delete(key);

                return;
            }

            query.set(key, String(value));
        });

        return query.toString();
    };

    const visitUsers = (overrides: Record<string, string | number | null | undefined> = {}) => {
        router.visit(`/admin/users?${buildQuery(overrides)}`, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const getUserLogTone = (action: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
        if (action.includes('role')) {
            return 'default';
        }

        if (action.includes('password')) {
            return 'secondary';
        }

        if (action.includes('disable') || action.includes('enable')) {
            return 'destructive';
        }

        return 'outline';
    };

    const applyFilters = () => {
        visitUsers();
    };

    return (
        <>
            <Head title="用户管理" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">
                <DashboardPageHeader
                    eyebrow="Users"
                    title="用户管理"
                    description="管理玩家与运营人员角色，查看账户基础信息，并进入关联审计。"
                    icon={Users}
                />

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <AdminStatCard title="当前页用户" value={users.data.length} />
                    <AdminStatCard title="运营人员" value={summary.adminCount} />
                    <AdminStatCard title="玩家" value={summary.playerCount} />
                </div>

                <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                    当前页共有 {summary.disabledCount} 位用户处于登录禁用状态，相关操作会同步写入审计日志。
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-base">用户列表</CardTitle>
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
                                                    visitUsers({ search: e.target.value })
                                                }
                                                placeholder="搜索姓名或邮箱..."
                                                className="h-9 pl-9 text-sm"
                                            />
                                        </div>
                                        <Select
                                            value={role}
                                            onValueChange={(value) =>
                                                visitUsers({ role: value })
                                            }
                                        >
                                            <SelectTrigger className="h-9 w-full">
                                                <SelectValue placeholder="全部角色" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">全部角色</SelectItem>
                                                <SelectItem value="admin">运营人员</SelectItem>
                                                <SelectItem value="player">玩家</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                }
                                onReset={() => router.visit('/admin/users', { replace: true, preserveScroll: true, preserveState: true })}
                                onApply={applyFilters}
                            />

                            <div className="space-y-3">
                                {users.data.map((user) => (
                                    <div key={user.id} className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/20">
                                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {user.role === 'admin' ? '运营人员' : '玩家'}
                                                    </Badge>
                                                    <Badge variant={user.login_disabled_at ? 'destructive' : 'secondary'} className="text-[10px]">
                                                        {user.login_disabled_at ? '登录已禁用' : '登录正常'}
                                                    </Badge>
                                                </div>
                                                {recentLogsByUser[user.id]?.[0] ? (
                                                    <div className="mt-2 space-y-2 rounded-xl border border-border/60 bg-background p-3">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge
                                                                variant={getUserLogTone(recentLogsByUser[user.id][0].action)}
                                                                className="text-[10px]"
                                                            >
                                                                最近操作 · {recentLogsByUser[user.id][0].action}
                                                            </Badge>
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {recentLogsByUser[user.id][0].created_at}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {recentLogsByUser[user.id][0].message}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        最近操作：暂无记录
                                                    </p>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="mt-2 h-7 px-2 text-xs"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/admin/logs?user_id=${user.id}&search=${encodeURIComponent(user.name)}&action=all&subject_type=all&from=&to=`,
                                                            {
                                                                preserveScroll: true,
                                                                preserveState: true,
                                                                replace: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <FileText className="mr-1 h-3.5 w-3.5" />
                                                    查看全部最近操作
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                                    <Eye className="mr-1 h-3.5 w-3.5" />
                                                    只读查看
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => router.patch(`/admin/users/${user.id}/role`, { role: user.role === 'admin' ? 'player' : 'admin', mode: 'role' }, { preserveScroll: true })}>
                                                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                                                    切换角色
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => router.patch(`/admin/users/${user.id}/role`, { role: user.role, mode: 'password' }, { preserveScroll: true })}>
                                                    <KeyRound className="mr-1 h-3.5 w-3.5" />
                                                    重置密码
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => router.patch(`/admin/users/${user.id}/role`, { role: user.role, mode: user.login_disabled_at ? 'enable' : 'disable' }, { preserveScroll: true })}>
                                                    <ShieldOff className="mr-1 h-3.5 w-3.5" />
                                                    {user.login_disabled_at ? '恢复登录' : '禁用登录'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <PaginationLinks pagination={users} />
                        </CardContent>
                    </Card>

                    <AdminDetailActionPanel
                        title="后台动作"
                        description="统一后台动作语气，直接返回总览、查看日志、导出用户。"
                        actions={[
                            {
                                label: '返回总览',
                                onClick: () =>
                                    router.visit(adminIndex.url(), {
                                        preserveScroll: true,
                                        preserveState: true,
                                        replace: true,
                                    }),
                                variant: 'default',
                                priority: 0,
                            },
                            {
                                label: '查看日志',
                                onClick: () =>
                                    router.visit('/admin/logs', {
                                        preserveScroll: true,
                                        preserveState: true,
                                        replace: true,
                                    }),
                                variant: 'outline',
                                priority: 1,
                            },
                            {
                                label: '导出用户',
                                onClick: () =>
                                    downloadUrl(`/admin/users/export?${buildQuery({})}`),
                                variant: 'outline',
                                priority: 2,
                            },
                        ]}
                    />
                </div>
            </div>
            <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>用户只读查看</DialogTitle>
                        <DialogDescription>这里展示用户基础信息，不可直接编辑。</DialogDescription>
                    </DialogHeader>
                    {selectedUser ? (
                        <div className="space-y-4 text-sm">
                            <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-4">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    摘要
                                </p>
                                <p className="font-medium">{selectedUser.name}</p>
                                <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="text-[10px]">
                                        {selectedUser.role === 'admin' ? '运营人员' : '玩家'}
                                    </Badge>
                                    <Badge variant={selectedUser.login_disabled_at ? 'destructive' : 'secondary'} className="text-[10px]">
                                        {selectedUser.login_disabled_at ? '登录已禁用' : '登录正常'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">上下文</p>
                                <p>创建时间：{selectedUser.created_at}</p>
                                <p>更新时间：{selectedUser.updated_at}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">最近操作</p>
                                <div className="space-y-3">
                                    {((recentLogsByUser[selectedUser.id] ?? []) as UserLogItem[]).length > 0 ? (
                                        (recentLogsByUser[selectedUser.id] ?? []).map((log) => (
                                            <div key={log.id} className="relative pl-4">
                                                <span className="absolute top-2 left-0 h-2.5 w-2.5 rounded-full bg-border" />
                                                <div className="rounded-xl border border-border bg-background p-3">
                                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                                        <Badge variant={getUserLogTone(log.action)} className="text-[10px]">
                                                            {log.action}
                                                        </Badge>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {log.created_at}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium leading-6">{log.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">暂无最近操作记录。</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.visit(
                                            `/admin/logs?user_id=${selectedUser.id}&search=${encodeURIComponent(selectedUser.name)}&action=all&subject_type=all&from=&to=`,
                                            {
                                                preserveScroll: true,
                                                preserveState: true,
                                                replace: true,
                                            },
                                        )
                                    }
                                >
                                    <FileText className="mr-1 h-3.5 w-3.5" />
                                    查看关联日志
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                                    关闭
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
}
