import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Calculator,
    Camera,
    Clapperboard,
    Compass,
    MessageSquare,
    PenTool,
} from 'lucide-react';
import { HomeCommunityPreview } from '@/components/community/home-community-preview';
import { ToolsBento } from '@/components/tools/tools-bento';
import { TutorialCard } from '@/components/tutorials/tutorial-card';
import { Button } from '@/components/ui/button';
import { community as communityRoute } from '@/routes';
import { index as contributeRoute } from '@/routes/contribute';
import { index as toolsRoute } from '@/routes/tools';
import { index as tutorialsRoute, show as showTutorialRoute } from '@/routes/tutorials';
import type { HomePageProps } from '@/types';

export default function Home({
    featuredTutorials,
    latestTutorials,
    recentCommunityPosts,
}: HomePageProps) {
    const { auth } = usePage().props as {
        auth: {
            user: {
                role?: 'admin' | 'player';
            } | null;
        };
    };
    const startHint =
        auth.user?.role === 'admin'
            ? {
                  title: '你是运营',
                  description:
                      '先去后台总览清理审核队列，再检查教程和社区动态。',
                  href: '/admin',
                  cta: '进入总览',
              }
            : auth.user
              ? {
                    title: '你是玩家',
                    description:
                        '先看教程，再到工具核对参数，最后把经验整理后提交到投稿台。',
                    href: contributeRoute.url(),
                    cta: '进入投稿台',
                }
              : {
                  title: '新来先看教程',
                  description:
                      '先从精选教程入手，再跟着工具和社区完成第一条拍摄闭环。',
                  href: tutorialsRoute.url(),
                  cta: '先看教程',
              };

    return (
        <>
            <Head title="首页" />

            <section className="border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-center">
                    <div className="space-y-5">
                        <span className="inline-flex items-center gap-2 rounded-full border border-red-900/60 bg-red-950/40 px-3 py-1 text-[11px] font-bold tracking-widest text-red-400 uppercase">
                            <Camera className="h-3.5 w-3.5" />
                            Pocket 3 创作者平台
                        </span>

                        <div className="space-y-3">
                            <h1 className="max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
                                不是只看一次的教程站，
                                <span className="text-red-500">而是拍前会回来查</span>
                                的内容工具平台
                            </h1>
                            <p className="max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                                学拍法、查参数、看避坑、问飞友、交投稿。把教程、工具箱、社区和投稿闭环放到一个入口里，让 Pocket 3
                                用户真正能拿来就用。
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild size="lg" className="bg-red-600 hover:bg-red-500">
                                <Link href={tutorialsRoute.url()}>
                                    进入教程库
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                            <Link
                                href={toolsRoute.url()}
                                className="inline-flex items-center gap-1 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                            >
                                进入工具箱
                                <Calculator className="h-4 w-4" />
                            </Link>
                        </div>

                        <Link
                            href={startHint.href}
                            className="flex flex-col gap-2 rounded-2xl border border-red-500/20 bg-red-950/10 p-4 transition-colors hover:border-red-500/40 hover:bg-red-950/20 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-400">
                                    {startHint.title}
                                </p>
                                <p className="text-sm leading-relaxed text-zinc-300">
                                    {startHint.description}
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-400">
                                {startHint.cta}
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </Link>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
                        <div className="space-y-1">
                            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                                现在就能用的入口
                            </h2>
                            <p className="text-xs leading-5 text-zinc-500">
                                直接按目标分流，少读一点说明，多做一步动作。
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            <PortalCard
                                href={tutorialsRoute.url()}
                                index="01"
                                title="教程库"
                                description="先把拍法、参数和步骤串起来。"
                                tagline="先看教程"
                                icon={Clapperboard}
                                accent="red"
                                prominent
                                className="sm:col-span-2 xl:col-span-1"
                            />
                            <PortalCard
                                href={toolsRoute.url()}
                                index="02"
                                title="工具箱"
                                tagline="先算参数"
                                icon={Calculator}
                                accent="amber"
                            />
                            <PortalCard
                                href={communityRoute.url()}
                                index="03"
                                title="玩家社区"
                                tagline="先看经验"
                                icon={MessageSquare}
                                accent="emerald"
                            />
                            <PortalCard
                                href={auth.user ? contributeRoute.url() : '/login'}
                                index="04"
                                title={auth.user ? '投稿工作台' : '登录后投稿'}
                                tagline="先投稿"
                                icon={auth.user ? PenTool : Compass}
                                accent="zinc"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <ToolsBento />

            <section className="border-b border-border bg-muted/20">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                Featured tutorials
                            </p>
                            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                                先看这些精选教程
                            </h2>
                        </div>
                        <Link
                            href={tutorialsRoute.url()}
                            className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                        >
                            查看全部教程
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featuredTutorials.map((tutorial) => (
                            <TutorialCard key={tutorial.id} tutorial={tutorial} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <div className="mb-5 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Latest tutorials
                                </p>
                                <h2 className="mt-2 text-xl font-extrabold">
                                    最新更新
                                </h2>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {latestTutorials.slice(0, 4).map((tutorial) => (
                                <Link
                                    key={tutorial.id}
                                    href={showTutorialRoute.url(tutorial.id)}
                                    className="rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/50"
                                >
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <span className="rounded-full bg-red-600/10 px-2 py-0.5 text-[10px] font-bold text-red-500">
                                            {tutorial.difficulty}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground">
                                            {tutorial.duration}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold">
                                        {tutorial.title}
                                    </h3>
                                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">
                                        {tutorial.summary}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <div className="mb-5 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                    Community
                                </p>
                                <h2 className="mt-2 text-xl font-extrabold">
                                    最近讨论
                                </h2>
                            </div>
                            <Link
                                href={communityRoute.url()}
                                className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                            >
                                进入社区
                            </Link>
                        </div>

                        <HomeCommunityPreview posts={recentCommunityPosts} hideCommunityLink />
                    </div>
                </div>
            </section>
        </>
    );
}

function PortalCard({
    href,
    index,
    title,
    description,
    tagline,
    icon: Icon,
    accent,
    prominent = false,
    className = '',
}: {
    href: string;
    index: string;
    title: string;
    description?: string;
    tagline: string;
    icon: typeof Clapperboard;
    accent: 'red' | 'amber' | 'emerald' | 'zinc';
    prominent?: boolean;
    className?: string;
}) {
    const cardClassMap = {
        red: 'border-red-500/20 bg-red-950/20 hover:border-red-500/40 hover:bg-red-950/30 text-red-400',
        amber: 'border-amber-500/20 bg-amber-950/20 hover:border-amber-500/40 hover:bg-amber-950/30 text-amber-400',
        emerald: 'border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500/40 hover:bg-emerald-950/30 text-emerald-400',
        zinc: 'border-zinc-700 bg-zinc-900/80 hover:border-zinc-600 hover:bg-zinc-900 text-zinc-300',
    } as const;

    const textClassMap = {
        red: 'text-red-400',
        amber: 'text-amber-400',
        emerald: 'text-emerald-400',
        zinc: 'text-zinc-200',
    } as const;

    return (
        <Link
            href={href}
            className={`group rounded-2xl border p-4 transition-colors ${cardClassMap[accent]} ${className} ${
                prominent ? 'min-h-[132px]' : 'min-h-[104px]'
            }`}
        >
            <div className="flex h-full flex-col justify-between gap-3">
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                            Step {index}
                        </p>
                        <span className={`inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2 py-1 text-[10px] font-semibold ${textClassMap[accent]}`}>
                            <Icon className="h-3 w-3" />
                            {tagline}
                        </span>
                    </div>
                    <h3
                        className={`tracking-tight text-foreground ${
                            prominent
                                ? 'text-lg font-extrabold'
                                : 'text-base font-bold'
                        }`}
                    >
                        {title}
                    </h3>
                    {description ? (
                        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    ) : null}
                </div>
                <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${textClassMap[accent]}`}>
                        进入
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
            </div>
        </Link>
    );
}
