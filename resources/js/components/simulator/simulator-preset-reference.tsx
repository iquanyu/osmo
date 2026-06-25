import type { CreatorPreset } from '@/types';

interface Props {
    creatorPresets: CreatorPreset[];
    onApplyPreset: (platform: string) => void;
}

export function SimulatorPresetReference({
    creatorPresets,
    onApplyPreset,
}: Props) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="border-b border-border pb-2">
                <h4 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
                    <span className="inline-block h-3.5 w-1.5 rounded-sm bg-red-600" />
                    <span>主流平台创作者实训参数手册</span>
                </h4>
                <p className="mt-1 text-[10px] text-muted-foreground">
                    老飞友与自媒体大 V 公认直出精品设置参数，点击卡片可一键导入上方模拟器面板。
                </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {creatorPresets.map((preset) => (
                    <button
                        key={preset.platform}
                        type="button"
                        onClick={() => onApplyPreset(preset.platform)}
                        className="flex cursor-pointer flex-col justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4 text-left shadow-sm transition-colors hover:border-primary/40"
                    >
                        <div className="space-y-1.5">
                            <span className="inline-block rounded-md border border-red-900/30 bg-red-950 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-red-400">
                                {preset.platform}
                            </span>
                            <h5 className="text-xs font-extrabold text-foreground">
                                规格：{preset.resolution} @ {preset.fps}
                            </h5>
                            <div className="w-full space-y-1 border-t border-border pt-1.5 font-mono text-[10px] leading-relaxed text-muted-foreground">
                                <div>
                                    <span className="block text-muted-foreground/60">
                                        色彩与光照：
                                    </span>
                                    <span className="font-bold text-foreground">
                                        {preset.color} ({preset.lightingCondition})
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-muted-foreground/60">
                                        云台与收音：
                                    </span>
                                    <span className="text-foreground">
                                        {preset.gimbal} 和 {preset.audio}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="border-t border-border pt-2 text-[10.5px] leading-relaxed text-muted-foreground italic">
                            🏆 大师锦囊：{preset.extraTips}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
