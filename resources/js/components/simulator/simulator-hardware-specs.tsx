import type { PocketSpec } from '@/types';

interface Props {
    generalSpecs: PocketSpec[];
}

export function SimulatorHardwareSpecs({ generalSpecs }: Props) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="border-b border-border pb-2">
                <h4 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
                    <span className="inline-block h-3.5 w-1.5 rounded-sm bg-red-600" />
                    <span>Pocket 3 旗舰核心硬件规格</span>
                </h4>
                <p className="mt-1 text-[10px] text-muted-foreground">
                    真实机型物理参数一览，专为1英寸大底传感器进行全向调优。
                </p>
            </div>
            <div className="space-y-3.5">
                {generalSpecs.map((spec) => (
                    <div
                        key={spec.feature}
                        className="flex flex-col gap-1 rounded-xl border border-border bg-muted/50 p-3"
                    >
                        <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="font-bold text-muted-foreground">
                                {spec.feature}
                            </span>
                            <span className="rounded-md border border-red-900/30 bg-red-950/40 px-1.5 py-0.5 text-[10px] font-medium text-red-400">
                                {spec.value}
                            </span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-muted-foreground">
                            {spec.tip}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
