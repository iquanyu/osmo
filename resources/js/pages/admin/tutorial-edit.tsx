import { Head, router } from '@inertiajs/react';
import { PencilLine } from 'lucide-react';
import { AdminDetailActionPanel } from '@/components/admin-detail-action-panel';
import { DashboardPageHeader } from '@/components/dashboard-page-header';
import { TutorialEditorForm } from '@/components/tutorial-editor-form';
import {
    community as adminCommunityRoute,
    index as adminIndex,
    submissions as adminSubmissionsRoute,
    tutorials as adminTutorials,
} from '@/routes/admin';
import type { AdminTutorialEditPageProps } from '@/types';

AdminTutorialEdit.layout = {
    breadcrumbs: [
        { title: '运营总览', href: adminIndex.url() },
        { title: '教程管理', href: adminTutorials.url() },
        { title: '编辑教程', href: '#' },
    ],
};

export default function AdminTutorialEdit({
    tutorial,
}: AdminTutorialEditPageProps) {
    return (
        <>
            <Head title={`编辑教程 - ${tutorial.title}`} />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 overflow-x-auto p-4 md:p-6">
                <DashboardPageHeader
                    eyebrow="Tutorial Library"
                    title="编辑教程"
                    description="在独立页面内维护教程内容，避免列表页承载过多编辑逻辑。"
                    icon={PencilLine}
                />

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <TutorialEditorForm tutorial={tutorial} />

                    <AdminDetailActionPanel
                        title="后台动作"
                        description="统一后台动作语气，直接返回教程、查看审核、查看社区。"
                        actions={[
                            {
                                label: '返回教程',
                                onClick: () =>
                                    router.visit(adminTutorials.url(), {
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
                            {
                                label: '返回总览',
                                onClick: () =>
                                    router.visit(adminIndex.url(), {
                                        preserveScroll: true,
                                        preserveState: true,
                                        replace: true,
                                    }),
                                variant: 'outline',
                                priority: 3,
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    );
}
