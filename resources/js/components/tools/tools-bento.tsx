import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Bookmark,
    Disc,
    Package,
    Sun,
    TableProperties,
} from 'lucide-react';
import { simulator as simulatorRoute } from '@/routes';
import {
    accessories as accessoriesRoute,
    ndCalculator as ndCalculatorRoute,
    specs as specsRoute,
} from '@/routes/tools';

const quickTools = [
    {
        title: '画质 / 续航',
        href: specsRoute.url(),
        icon: TableProperties,
        accent: 'text-amber-500',
        border: 'hover:border-amber-500/40',
    },
    {
        title: '配件红黑榜',
        href: accessoriesRoute.url(),
        icon: Package,
        accent: 'text-emerald-500',
        border: 'hover:border-emerald-500/40',
    },
    {
        title: '参数模拟器',
        href: simulatorRoute.url(),
        icon: Disc,
        accent: 'text-zinc-400',
        border: 'hover:border-zinc-500/40',
    },
];

export function ToolsBento() {
    return (
        <section className="border-b border-border bg-muted/20">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
                {/* 紧凑顶栏：工具页专用，非教程 Hero */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
                                <Sun className="h-4 w-4" />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                查阅工具
                            </span>
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                            工具箱
                        </h1>
                        <p className="mt-1 max-w-md text-sm text-muted-foreground">
                            算参数、查规格、避坑配件——户外拍摄时收藏本页，秒开即用。
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-background/80 px-3 py-2 text-xs text-muted-foreground">
                        <Bookmark className="h-3.5 w-3.5 shrink-0 text-red-500" />
                        <span>建议将 ND 计算器加入浏览器书签</span>
                    </div>
                </div>

                {/* Bento：功能导向，非左右分栏 Hero */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-2">
                    <Link
                        href={ndCalculatorRoute.url()}
                        className="group col-span-2 row-span-2 flex min-h-[220px] flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:border-red-500/50 hover:shadow-md lg:min-h-0"
                    >
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                    <Sun className="h-3 w-3" />
                                    最常用
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                    180° rule
                                </span>
                            </div>
                            <h2 className="text-lg font-extrabold text-foreground group-hover:text-red-600 dark:group-hover:text-red-400">
                                ND 滤镜计算器
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                输入帧率与环境，即时算出快门速度与 ND
                                规格。教程详情页也会内嵌此工具。
                            </p>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                                <span className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-foreground">
                                    24fps · 1/48s
                                </span>
                                <span className="rounded-lg border border-red-900/30 bg-red-950/30 px-2.5 py-1 text-red-400">
                                    烈日 EV15 → ND16
                                </span>
                                <span className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-muted-foreground">
                                    ISO / 快门角可调
                                </span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 dark:text-red-400">
                                打开计算器
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </div>
                    </Link>

                    {quickTools.map((tool) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className={`group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md ${tool.border}`}
                        >
                            <tool.icon
                                className={`h-5 w-5 ${tool.accent}`}
                            />
                            <div className="mt-3">
                                <h2 className="text-sm font-bold text-foreground">
                                    {tool.title}
                                </h2>
                                <ArrowRight className="mt-2 h-3.5 w-3.5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
