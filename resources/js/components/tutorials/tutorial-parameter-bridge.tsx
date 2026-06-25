import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Calculator,
    Check,
    Copy,
    Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { NdCalculatorFromSettings } from '@/components/tools/nd-calculator';
import { Button } from '@/components/ui/button';
import {
    formatNdResultForCopy,
    useNdCalculatorFromSettings,
} from '@/hooks/use-nd-calculator';
import { copyToClipboard } from '@/lib/copy-to-clipboard';
import { ndCalculator as ndCalculatorRoute } from '@/routes/tools';
import { index as tutorialsRoute } from '@/routes/tutorials';
import type { TutorialSettings } from '@/types';

interface Props {
    title: string;
    summary: string;
    settings: TutorialSettings;
}

function settingsCopyText(settings: TutorialSettings): string {
    return [
        `分辨率：${settings.resolution}`,
        `色彩空间：${settings.colorProfile}`,
        `云台模式：${settings.gimbalMode}`,
        `ND 建议：${settings.ndFilter}`,
    ].join('\n');
}

function buildTutorialCardText(
    title: string,
    summary: string,
    settings: TutorialSettings,
    ndText: string,
): string {
    return [
        `教程：${title}`,
        `简介：${summary}`,
        settingsCopyText(settings),
        `ND 预估：${ndText}`,
    ].join('\n');
}

export function TutorialParameterBridge({
    title,
    summary,
    settings,
}: Props) {
    const { result } = useNdCalculatorFromSettings(
        settings.resolution,
        settings.ndFilter,
    );

    const copySettings = async () => {
        const success = await copyToClipboard(settingsCopyText(settings));

        if (success) {
            toast.success('参数已复制，可以直接带去工具页');

            return;
        }

        toast.error('复制失败，请手动查看下方参数');
    };

    const copyNdResult = async () => {
        const success = await copyToClipboard(formatNdResultForCopy(result));

        if (success) {
            toast.success('ND 建议已复制');

            return;
        }

        toast.error('复制失败，请手动查看结果卡');
    };

    const copyTutorialCard = async () => {
        const ndText =
            result.ndFilter === 'None'
                ? '当前参数无需 ND'
                : `建议 ${result.ndFilter}，对应 ${result.ndStops} 档减光`;
        const success = await copyToClipboard(
            buildTutorialCardText(title, summary, settings, ndText),
        );

        if (success) {
            toast.success('整套教程卡已复制');

            return;
        }

        toast.error('复制失败，请手动查看卡片内容');
    };

    return (
        <div className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/20 via-card to-card p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-950/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-red-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        内容 + 工具闭环
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                            {title}：这套参数可以直接拿去算，算完就能拍
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            {summary}
                        </p>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            看完教程后，不用手动抄一遍。这里把关键拍摄参数直接整理好，先复制，再去 ND 计算器校验一遍，最后到模拟器里看成片效果。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                            { label: '分辨率', value: settings.resolution },
                            { label: '色彩空间', value: settings.colorProfile },
                            { label: '云台模式', value: settings.gimbalMode },
                            { label: 'ND 建议', value: settings.ndFilter },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-2xl border border-border bg-background/80 px-4 py-3"
                            >
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {item.label}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                    <Button
                        type="button"
                        onClick={copySettings}
                        className="gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500"
                    >
                        <Copy className="h-4 w-4" />
                        复制这套参数
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="gap-2 rounded-xl border-border bg-background px-4 py-2.5 text-sm font-semibold"
                    >
                        <Link href={ndCalculatorRoute.url()}>
                            <Calculator className="h-4 w-4" />
                            去 ND 计算器
                        </Link>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={copyTutorialCard}
                        className="gap-2 rounded-xl border-border bg-background px-4 py-2.5 text-sm font-semibold"
                    >
                        <Sparkles className="h-4 w-4" />
                        复制整套教程卡
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className="gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
                    >
                        <Link href={tutorialsRoute.url()}>
                            返回教程列表
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <Check className="h-4 w-4 text-emerald-500" />
                        复制后可以直接带去工具页对照
                    </div>
                    <pre className="overflow-x-auto rounded-2xl border border-border bg-background/90 p-4 font-mono text-xs leading-6 text-muted-foreground">
{settingsCopyText(settings)}
                    </pre>
                    <div className="rounded-2xl border border-border bg-background/80 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    ND 预估建议
                                </p>
                                <p className="mt-1 text-sm font-semibold text-foreground">
                                    {result.ndFilter === 'None'
                                        ? '当前参数无需 ND'
                                        : `建议 ${result.ndFilter}，对应 ${result.ndStops} 档减光`}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    {result.summary}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={copyNdResult}
                                className="shrink-0 gap-2 rounded-xl border-border bg-background px-3 py-2 text-xs font-semibold"
                            >
                                <Copy className="h-4 w-4" />
                                复制 ND 建议
                            </Button>
                        </div>
                    </div>
                </div>

                <NdCalculatorFromSettings
                    resolution={settings.resolution}
                    ndFilter={settings.ndFilter}
                    compact
                    className="self-start"
                />
            </div>
        </div>
    );
}
