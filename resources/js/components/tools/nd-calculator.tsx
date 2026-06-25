import { Sun } from 'lucide-react';
import { NdCalculatorControls } from '@/components/tools/nd-calculator-controls';
import { NdCalculatorResultPanel } from '@/components/tools/nd-calculator-result-panel';
import {
    useNdCalculatorFromSettings,
    useNdCalculatorState,
} from '@/hooks/use-nd-calculator';
import type { NdFps, NdIso, NdLighting } from '@/lib/nd-calculator';

interface Props {
    defaultFps?: NdFps;
    defaultLighting?: NdLighting;
    defaultIso?: NdIso;
    compact?: boolean;
    className?: string;
}

export function NdCalculator({
    defaultFps = 24,
    defaultLighting = 'bright_sun',
    defaultIso = 100,
    compact = false,
    className = '',
}: Props) {
    const { state, patch, result } = useNdCalculatorState({
        fps: defaultFps,
        lighting: defaultLighting,
        iso: defaultIso,
        shutterAngle: 180,
    });

    return (
        <div
            className={`rounded-2xl border border-red-500/20 bg-card ${compact ? 'p-4' : 'p-6'} ${className}`}
        >
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-red-500" />
                    <h3
                        className={`font-bold text-foreground ${compact ? 'text-sm' : 'text-base'}`}
                    >
                        ND 滤镜 / 曝光计算器
                    </h3>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                    f/2.0 固定
                </span>
            </div>

            <div className="space-y-4">
                <NdCalculatorControls
                    state={state}
                    onChange={patch}
                    compact={compact}
                />
                <NdCalculatorResultPanel
                    result={result}
                    showFormula={!compact}
                    prominent={false}
                />
            </div>
        </div>
    );
}

export function NdCalculatorFromSettings({
    resolution,
    ndFilter,
    compact = false,
    className = '',
}: {
    resolution: string;
    ndFilter: string;
    compact?: boolean;
    className?: string;
}) {
    const { state, patch, result } = useNdCalculatorFromSettings(
        resolution,
        ndFilter,
    );

    return (
        <div
            className={`rounded-2xl border border-red-500/20 bg-card ${compact ? 'p-4' : 'p-6'} ${className}`}
        >
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-red-500" />
                    <h3 className="text-sm font-bold text-foreground">
                        ND 滤镜 / 曝光计算器
                    </h3>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                    f/2.0
                </span>
            </div>

            <div className="space-y-4">
                <NdCalculatorControls
                    state={state}
                    onChange={patch}
                    compact={compact}
                />
                <NdCalculatorResultPanel
                    result={result}
                    showFormula={false}
                    prominent={false}
                />
            </div>
        </div>
    );
}
