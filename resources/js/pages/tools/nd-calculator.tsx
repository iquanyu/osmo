import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { NdCalculatorControls } from '@/components/tools/nd-calculator-controls';
import { NdCalculatorReferences } from '@/components/tools/nd-calculator-references';
import { NdCalculatorResultPanel } from '@/components/tools/nd-calculator-result-panel';
import {
    ND_CALCULATOR_PRESETS,
    useNdCalculatorState,
} from '@/hooks/use-nd-calculator';
import { index as toolsRoute } from '@/routes/tools';

export default function ToolsNdCalculator() {
    const { state, patch, result, applyPreset } = useNdCalculatorState();

    return (
        <>
            <Head title="ND 滤镜计算器" />

            <div className="border-b border-border bg-muted/20">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
                    <Link
                        href={toolsRoute.url()}
                        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        返回工具箱
                    </Link>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-500">
                                工具 01 · ND / 曝光计算
                            </span>
                            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                                ND 滤镜计算器
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                基于场景 EV 与 Pocket 3 固定 f/2.0
                                光圈，计算 180° 快门与所需减光档位。左侧调参，右侧实时看结果。
                            </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-background/80 px-3 py-2 text-xs text-muted-foreground">
                            <Bookmark className="h-3.5 w-3.5 shrink-0 text-red-500" />
                            <span>户外拍摄建议收藏本页</span>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {ND_CALCULATOR_PRESETS.map((preset) => (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => applyPreset(preset)}
                                className="rounded-full border border-border bg-background px-3 py-1.5 text-left transition-colors hover:border-red-500/40 hover:bg-red-950/20"
                            >
                                <span className="block text-xs font-semibold text-foreground">
                                    {preset.label}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                    {preset.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
                    <div className="lg:col-span-3">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                                拍摄参数
                            </h2>
                            <span className="font-mono text-[10px] text-muted-foreground">
                                f/2.0 固定光圈
                            </span>
                        </div>
                        <NdCalculatorControls
                            state={state}
                            onChange={patch}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <div className="mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                                计算结果
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                随左侧参数实时更新
                            </p>
                        </div>
                        <div className="lg:sticky lg:top-24">
                            <NdCalculatorResultPanel
                                result={result}
                                prominent
                            />
                        </div>
                    </div>
                </div>

                <section className="mt-12 rounded-2xl border border-border bg-muted/20 p-6 sm:p-8">
                    <NdCalculatorReferences />
                </section>
            </div>
        </>
    );
}
