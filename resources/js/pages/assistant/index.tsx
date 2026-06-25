import { Head } from '@inertiajs/react';
import { AlertCircle, ArrowRight, ListChecks, Loader2, Sparkles, VolumeX, Wrench } from 'lucide-react';
import { useState } from 'react';
import type { AISuggestion } from '@/types';

const presetScenarios = [
    '在风很大的海边，用DJI麦克风拍摄行走自拍Vlog',
    '傍晚落日时分，在天桥上手持拍摄川流不息的车轨延时',
    '室内咖啡屋，给刚点的咖啡拉花做一件精美的微距特写',
    '昏暗灯火的夜间街头拍摄古风人像行摄，防止虚影和噪点',
];

export default function AssistantIndex() {
    const [scenario, setScenario] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);

    const handleFetchAssistant = async (text: string) => {
        if (!text.trim()) {
return;
}

        setIsLoading(true);
        setError(null);
        setSuggestion(null);

        try {
            const response = await fetch('/assistant/suggest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ scenario: text }),
            });

            if (!response.ok) {
throw new Error('向摄制助手发送请求失败');
}

            const data = await response.json();

            if (data.error) {
throw new Error(data.error);
}

            setSuggestion(data);
        } catch (err: any) {
            setError(err.message || '未知连接错误，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="场景摄制助手" />
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="bg-gradient-to-r from-card via-muted/50 to-card border border-border p-6 rounded-3xl mb-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-900/40 text-red-400 rounded-full text-xs font-medium mb-4">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>场景预设引擎已就绪</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-2">大疆 Pocket 3 【场景预设摄制助手】</h2>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                            输入您要拍摄的任何生活场景、天气状况、或者是创意构想（例如"风大的海滩拍开箱"），系统将基于内置场景预设为您推荐<b>分辨率与帧数、感光上限、快门数值、是否需磁吸ND镜、DJI Mic 2 降噪建议以及专业运镜轨迹</b>。
                        </p>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={scenario}
                            onChange={(e) => setScenario(e.target.value)}
                            disabled={isLoading}
                            placeholder="说明您的拍摄题材，如：夜景街头暗光自拍、高速滑板推轨追踪..."
                            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-red-600 transition-colors placeholder:text-muted-foreground/60"
                        />
                        <button
                            onClick={() => handleFetchAssistant(scenario)}
                            disabled={isLoading || !scenario.trim()}
                            className="sm:w-auto w-full bg-red-600 text-white font-semibold hover:bg-red-500 rounded-xl px-5 py-3 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isLoading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /><span>分析参数中...</span></>
                            ) : (
                                <><span>获取方案</span><ArrowRight className="h-4 w-4" /></>
                            )}
                        </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                        <span className="text-[10px] text-muted-foreground font-bold block mb-2 uppercase tracking-wide">快速选用经典测评场景：</span>
                        <div className="flex flex-wrap gap-2">
                            {presetScenarios.map((p, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
 setScenario(p); handleFetchAssistant(p); 
}}
                                    disabled={isLoading}
                                    className="bg-muted/80 border border-border hover:border-primary/40 hover:text-foreground text-muted-foreground px-3 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {isLoading && (
                    <div className="bg-card border border-border p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                        <Loader2 className="h-6 w-6 text-red-500 animate-spin" />
                        <p className="text-muted-foreground text-xs">正在协调 Pocket 3 摄影机性能，分析最适宜的 10-bit 取景与 180度快门 调配方案...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-950/20 border border-red-900/50 text-red-300 p-4 rounded-xl flex gap-2.5 items-start text-xs leading-relaxed">
                        <AlertCircle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                        <div>
                            <span className="font-bold block mb-0.5">获取场景建议时发生异常</span>
                            <span>{error}。您可以点击上方预设重试。</span>
                        </div>
                    </div>
                )}

                {suggestion && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 flex flex-col gap-4">
                            <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5 border-b border-border pb-2">
                                    <ListChecks className="h-3.5 w-3.5 text-red-500" />
                                    Pocket 3 实操数据参数
                                </h3>
                                <div className="flex flex-col gap-3 font-mono text-xs">
                                    <div><span className="text-[10px] text-muted-foreground block uppercase font-bold">分辨率与帧率</span><span className="text-foreground font-black text-xs">{suggestion.settings.resolution}</span></div>
                                    <div><span className="text-[10px] text-muted-foreground block uppercase font-bold">色彩模式建议</span><span className="text-amber-400 font-extrabold text-xs">{suggestion.settings.colorProfile}</span></div>
                                    <div><span className="text-[10px] text-muted-foreground block uppercase font-bold">曝光方法档位</span><span className="text-foreground font-semibold text-xs">{suggestion.settings.exposureMode}</span></div>
                                    <div><span className="text-[10px] text-muted-foreground block uppercase font-bold">推荐快门数值</span><span className="text-foreground font-semibold text-xs">{suggestion.settings.shutterSpeed}</span></div>
                                    <div><span className="text-[10px] text-muted-foreground block uppercase font-bold">ISO 感光范围限制</span><span className="text-foreground font-bold text-xs">{suggestion.settings.isoRange}</span></div>
                                    <div><span className="text-[10px] text-muted-foreground block uppercase font-bold">云台锁定跟随模式</span><span className="text-red-400 font-semibold text-xs">{suggestion.settings.gimbalMode}</span></div>
                                </div>
                            </div>
                            <div className="bg-card border border-border rounded-2xl p-5 shadow-md">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5 border-b border-border pb-2">
                                    <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                                    外挂装备搭配建议
                                </h3>
                                <div className="flex flex-col gap-3 text-xs leading-relaxed">
                                    <div>
                                        <span className="text-[10px] text-muted-foreground block font-bold uppercase mb-0.5">【减光镜方案】</span>
                                        <p className="text-[11px] text-foreground/80">{suggestion.ndFilter}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-muted-foreground block font-bold uppercase mb-0.5">【DJI Mic 2 收音方案】</span>
                                        <p className="text-[11px] text-foreground/80">{suggestion.audioSetup}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-8 bg-card/50 border border-border rounded-2xl p-6 shadow-xl flex flex-col gap-6">
                            <div>
                                <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase font-bold block">技术原理解析</span>
                                <h3 className="text-lg font-extrabold text-foreground mt-1 mb-2">大底镜头配置策略拆解</h3>
                                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{suggestion.explanation}</p>
                            </div>
                            <div className="border-t border-border pt-5">
                                <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase block mb-3 font-bold">大师镜头运动创意演练 (动作提纲)</span>
                                <ul className="space-y-3">
                                    {suggestion.creativeTips.map((tip, idx) => (
                                        <li key={idx} className="flex gap-3 text-xs sm:text-sm items-start bg-muted/40 p-3 rounded-xl border border-border hover:border-primary/40 transition-all">
                                            <span className="w-5 h-5 rounded-full bg-red-950 border border-red-900 text-red-400 text-xs flex items-center justify-center font-bold font-mono">{idx + 1}</span>
                                            <span className="text-muted-foreground leading-relaxed pt-0.5">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {suggestion.explanation.includes('本地预设') && (
                                <div className="bg-amber-950/10 border border-amber-900/30 p-2 text-[10px] text-amber-500 rounded flex gap-1 items-center font-mono">
                                    <VolumeX className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span>温馨提醒：以上为离线精品指引方案，基于 Pocket 3 真实硬件参数精心调校。</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
