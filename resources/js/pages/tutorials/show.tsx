import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Camera, Copy, RotateCcw } from 'lucide-react';
import { NdCalculatorFromSettings } from '@/components/tools/nd-calculator';
import { TutorialParameterBridge } from '@/components/tutorials/tutorial-parameter-bridge';
import { TutorialSettingsGrid } from '@/components/tutorials/tutorial-settings-grid';
import { TutorialStepList } from '@/components/tutorials/tutorial-step-list';
import { TutorialTipsCallout } from '@/components/tutorials/tutorial-tips-callout';
import {
    getTutorialCategoryLabel,
    getTutorialDifficultyLabel,
} from '@/lib/tutorial-meta';
import { simulator as simulatorRoute } from '@/routes';
import { index as tutorialsRoute } from '@/routes/tutorials';
import type { TutorialShowPageProps } from '@/types';

export default function TutorialsShow({ tutorial }: TutorialShowPageProps) {
    return (
        <>
            <Head title={tutorial.title} />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <Link
                    href={tutorialsRoute.url()}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    返回教程
                </Link>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                            <div className="relative aspect-video w-full bg-muted">
                                <img
                                    src={tutorial.image}
                                    alt={tutorial.title}
                                    className="h-full w-full object-cover opacity-75"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute bottom-4 left-6 right-6">
                                    <div className="mb-2 flex flex-wrap gap-2">
                                        <span className="rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                                            {getTutorialDifficultyLabel(tutorial.difficulty)}实弹演练
                                        </span>
                                        <span className="rounded-md border border-border bg-black/60 px-2 py-1 text-[10px] font-bold text-white">
                                            {getTutorialCategoryLabel(tutorial.category)}
                                        </span>
                                        <span className="rounded-md border border-border bg-black/60 px-2 py-1 font-mono text-[10px] text-white">
                                            {tutorial.duration}
                                        </span>
                                    </div>
                                    <h1 className="text-xl font-extrabold text-white sm:text-3xl">
                                        {tutorial.title}
                                    </h1>
                                </div>
                            </div>

                            <div className="space-y-6 p-6">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {tutorial.summary}
                                </p>

                                <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground sm:grid-cols-3">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest">
                                            Step 1
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            先看结论
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest">
                                            Step 2
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            再核对参数
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest">
                                            Step 3
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            最后去模拟器
                                        </p>
                                    </div>
                                </div>

                                <TutorialParameterBridge
                                    title={tutorial.title}
                                    summary={tutorial.summary}
                                    settings={tutorial.settings}
                                />

                                <TutorialSettingsGrid settings={tutorial.settings} />
                                <TutorialStepList steps={tutorial.steps} />
                                <TutorialTipsCallout tips={tutorial.tips} />
                            </div>

                            <div className="flex flex-col items-start justify-between gap-3 border-t border-border bg-card p-6 sm:flex-row sm:items-center">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                                        Quick next
                                    </p>
                                    <span className="font-mono text-[11px] text-muted-foreground">
                                        这篇实操教程来自 DJI 玩家经验社区归档。
                                    </span>
                                </div>
                                <Link
                                    href={simulatorRoute.url()}
                                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-500 sm:w-auto"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    <span>去模拟器看效果</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <aside className="hidden lg:block">
                        <div className="sticky top-24">
                            <div className="mb-4 rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/20 via-card to-card p-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                                    下一步
                                </p>
                                <h2 className="mt-1 text-sm font-semibold text-foreground">
                                    先用参数，再去验证画面
                                </h2>
                                <div className="mt-4 space-y-2">
                                    <div className="rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-muted-foreground">
                                        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                                            <Copy className="h-3.5 w-3.5 text-red-500" />
                                            参数卡支持直接复制
                                        </span>
                                    </div>
                                    <Link
                                        href={simulatorRoute.url()}
                                        className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-red-500/40 hover:bg-red-950/20"
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <Camera className="h-3.5 w-3.5 text-red-500" />
                                            进入模拟器
                                        </span>
                                        <RotateCcw className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                            <div className="mb-4 rounded-2xl border border-border bg-card p-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    快速入口
                                </p>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    参数看完，立刻校验曝光和 ND
                                </p>
                            </div>
                            <NdCalculatorFromSettings
                                resolution={tutorial.settings.resolution}
                                ndFilter={tutorial.settings.ndFilter}
                                compact
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
