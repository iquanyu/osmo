import {
    AlertTriangle,
    CheckCircle2,
    Copy,
    Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { NdCalculatorReferences } from '@/components/tools/nd-calculator-references';
import { Button } from '@/components/ui/button';
import {
    formatNdResultForCopy
    
} from '@/hooks/use-nd-calculator';
import type {NdCalculatorResult} from '@/hooks/use-nd-calculator';
import { copyToClipboard } from '@/lib/copy-to-clipboard';

function ExposureIcon({
    status,
}: {
    status: NdCalculatorResult['exposureStatus'];
}) {
    if (status === 'ok') {
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    }

    if (status === 'underexposed') {
        return <Info className="h-5 w-5 text-blue-500" />;
    }

    return <AlertTriangle className="h-5 w-5 text-amber-500" />;
}

function statusStyles(status: NdCalculatorResult['exposureStatus']) {
    if (status === 'ok') {
        return 'border-emerald-500/30 bg-emerald-950/20';
    }

    if (status === 'underexposed') {
        return 'border-blue-500/30 bg-blue-950/20';
    }

    if (status === 'overexposed') {
        return 'border-amber-500/40 bg-amber-950/25';
    }

    return 'border-red-500/30 bg-red-950/20';
}

function EvExposureBar({ result }: { result: NdCalculatorResult }) {
    const minEv = 5;
    const maxEv = 16;
    const range = maxEv - minEv;

    const scenePct = Math.min(
        100,
        Math.max(0, ((result.sceneEv - minEv) / range) * 100),
    );
    const maxPct = Math.min(
        100,
        Math.max(0, ((result.maxSceneEvWithoutNd - minEv) / range) * 100),
    );

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>场景亮度 EV{result.sceneEv}</span>
                <span>无 ND 上限 EV{result.maxSceneEvWithoutNd}</span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-emerald-600/50"
                    style={{ width: `${maxPct}%` }}
                />
                {result.stopsNeeded > 0 && (
                    <div
                        className="absolute inset-y-0 rounded-full bg-red-500/60"
                        style={{
                            left: `${maxPct}%`,
                            width: `${Math.max(0, scenePct - maxPct)}%`,
                        }}
                    />
                )}
                <div
                    className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-white shadow"
                    style={{ left: `calc(${scenePct}% - 1px)` }}
                    title={`场景 EV${result.sceneEv}`}
                />
            </div>
            <p className="text-[10px] text-muted-foreground">
                绿色为当前快门/ISO 可承载范围；红色超出部分需 ND 吸收（约{' '}
                {result.stopsNeeded} 档）。
            </p>
        </div>
    );
}

export function NdCalculatorDisclaimer({ compact = false }: { compact?: boolean }) {
    return (
        <div className="space-y-2">
            <p
                className={`leading-relaxed text-muted-foreground ${compact ? 'text-[10px]' : 'text-xs'}`}
            >
                结果基于通用曝光公式（180° 快门法则 + EV
                估算），场景 EV 与 ND
                档位为行业常见参考值，非 DJI
                官方标定。实际拍摄请以机内直方图、斑马纹及所用 ND
                镜实测为准。
            </p>
            <NdCalculatorReferences compact />
        </div>
    );
}

interface Props {
    result: NdCalculatorResult;
    showFormula?: boolean;
    prominent?: boolean;
}

export function NdCalculatorResultPanel({
    result,
    showFormula = true,
    prominent = false,
}: Props) {
    const copyResult = async () => {
        const text = formatNdResultForCopy(result);
        const success = await copyToClipboard(text);

        if (success) {
            toast.success('参数建议已复制');

            return;
        }

        toast.error('无法写入剪贴板，请长按下方文字手动复制');
    };

    const ndDisplay =
        result.ndFilter === 'None' ? '无需 ND' : result.ndFilter;

    const copyText = formatNdResultForCopy(result);

    return (
        <div className="space-y-4">
            <div
                className={`overflow-hidden rounded-2xl border ${statusStyles(result.exposureStatus)}`}
            >
                <div className="border-b border-border/50 px-5 py-4">
                    <div className="flex items-start gap-3">
                        <ExposureIcon status={result.exposureStatus} />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground">
                                {result.exposureLabel}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                {result.summary}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-border/50 border-b border-border/50">
                    <div
                        className={`px-5 py-6 text-center ${prominent ? 'sm:py-8' : ''}`}
                    >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            推荐 ND
                        </p>
                        <p
                            className={`mt-1 font-extrabold tracking-tight text-red-500 ${prominent ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}
                        >
                            {ndDisplay}
                        </p>
                        {result.ndStops > 0 && (
                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                                {result.ndStops} 档减光
                            </p>
                        )}
                    </div>
                    <div
                        className={`px-5 py-6 text-center ${prominent ? 'sm:py-8' : ''}`}
                    >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            目标快门
                        </p>
                        <p
                            className={`mt-1 font-mono font-extrabold text-foreground ${prominent ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}
                        >
                            {result.shutterSpeed}
                        </p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                            {result.shutterAngle}° · {result.fps}fps
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-px bg-border/50">
                    {[
                        { label: '光圈', value: result.aperture },
                        { label: 'ISO', value: String(result.iso) },
                        {
                            label: '需减光',
                            value: `${result.stopsNeeded} 档`,
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="bg-card/80 px-3 py-3 text-center"
                        >
                            <p className="text-[9px] uppercase text-muted-foreground">
                                {item.label}
                            </p>
                            <p className="mt-0.5 font-mono text-xs font-bold text-foreground">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    曝光余量
                </p>
                <EvExposureBar result={result} />
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    滤镜对照
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {result.filterOptions.map((option) => {
                        const isRecommended =
                            option.label === result.ndFilter ||
                            (result.ndFilter === 'None' &&
                                option.label === '无滤镜');

                        return (
                            <div
                                key={option.label}
                                className={`rounded-xl border px-3 py-2.5 text-center transition-colors ${
                                    isRecommended
                                        ? 'border-red-600 bg-red-950/40'
                                        : option.fits
                                          ? 'border-emerald-900/40 bg-emerald-950/20'
                                          : 'border-border bg-muted/30 opacity-60'
                                }`}
                            >
                                <p
                                    className={`text-xs font-bold ${isRecommended ? 'text-red-400' : 'text-foreground'}`}
                                >
                                    {option.label}
                                </p>
                                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                                    {option.stops > 0
                                        ? `${option.stops} 档`
                                        : '原亮度'}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                    {result.tip}
                </p>
                {showFormula && (
                    <p className="rounded-lg border border-dashed border-border bg-background/60 px-3 py-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
                        {result.formulaNote}
                    </p>
                )}
                <NdCalculatorDisclaimer compact={!showFormula} />
            </div>

            {showFormula && (
                <pre
                    className="select-all rounded-xl border border-border bg-muted/30 p-3 font-mono text-[10px] leading-relaxed text-muted-foreground whitespace-pre-wrap"
                    aria-label="可复制文本"
                >
                    {copyText}
                </pre>
            )}

            <Button
                type="button"
                className="w-full bg-red-600 hover:bg-red-500"
                onClick={copyResult}
            >
                <Copy className="mr-1.5 h-4 w-4" />
                复制完整建议
            </Button>
        </div>
    );
}
