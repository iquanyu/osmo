import type { ReactNode } from 'react';
import type { NdCalculatorState } from '@/hooks/use-nd-calculator';
import {
    ND_FPS_OPTIONS,
    ND_ISO_OPTIONS,
    ND_LIGHTING_OPTIONS,
    SHUTTER_ANGLE_OPTIONS
} from '@/lib/nd-calculator';
import type { NdIso, NdLighting } from '@/lib/nd-calculator';

interface Props {
    state: NdCalculatorState;
    onChange: (partial: Partial<NdCalculatorState>) => void;
    compact?: boolean;
}

function ControlSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {title}
            </h3>
            {children}
        </div>
    );
}

export function NdCalculatorControls({
    state,
    onChange,
    compact = false,
}: Props) {
    const selectedLighting = ND_LIGHTING_OPTIONS.find(
        (option) => option.value === state.lighting,
    );

    return (
        <div className="space-y-4">
            <ControlSection title="拍摄帧率">
                <div className="grid grid-cols-4 gap-2">
                    {ND_FPS_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange({ fps: option.value })}
                            className={`rounded-xl border py-2 text-xs font-mono font-bold transition-colors ${
                                state.fps === option.value
                                    ? 'border-red-600 bg-red-600 text-white'
                                    : 'border-border bg-muted/30 text-muted-foreground hover:border-red-500/40'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </ControlSection>

            {!compact && (
                <ControlSection title="快门角度">
                    <div className="grid grid-cols-4 gap-2">
                        {SHUTTER_ANGLE_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                    onChange({
                                        shutterAngle: option.value,
                                    })
                                }
                                title={option.hint}
                                className={`rounded-xl border py-2 text-xs font-mono font-bold transition-colors ${
                                    state.shutterAngle === option.value
                                        ? 'border-red-600 bg-red-950/40 text-red-400'
                                        : 'border-border bg-muted/30 text-muted-foreground hover:border-red-500/40'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                        {
                            SHUTTER_ANGLE_OPTIONS.find(
                                (o) => o.value === state.shutterAngle,
                            )?.hint
                        }
                    </p>
                </ControlSection>
            )}

            <ControlSection title="感光度 ISO">
                <div
                    className={`grid gap-2 ${compact ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6'}`}
                >
                    {ND_ISO_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                                onChange({ iso: option.value as NdIso })
                            }
                            className={`rounded-xl border py-2 text-[10px] font-mono font-bold transition-colors ${
                                state.iso === option.value
                                    ? 'border-amber-600 bg-amber-950/40 text-amber-400'
                                    : 'border-border bg-muted/30 text-muted-foreground hover:border-amber-500/40'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </ControlSection>

            <ControlSection title="环境光（场景 EV）">
                <div className="grid grid-cols-2 gap-2">
                    {ND_LIGHTING_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                                onChange({
                                    lighting: option.value as NdLighting,
                                })
                            }
                            title={option.description}
                            className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                                state.lighting === option.value
                                    ? 'border-red-600 bg-red-950/30'
                                    : 'border-border bg-muted/30 hover:border-red-500/40'
                            }`}
                        >
                            <span
                                className={`block text-xs font-semibold ${
                                    state.lighting === option.value
                                        ? 'text-red-400'
                                        : 'text-foreground'
                                }`}
                            >
                                {option.label}
                            </span>
                            <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                                EV {option.ev}
                            </span>
                        </button>
                    ))}
                </div>
                {selectedLighting && !compact && (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {selectedLighting.description}
                    </p>
                )}
            </ControlSection>
        </div>
    );
}
