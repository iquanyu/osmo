import { useMemo, useState } from 'react';
import {
    calculateNdRecommendation,
    formatNdResultForCopy,
    inferLightingFromNdFilter,
    parseFpsFromResolution
} from '@/lib/nd-calculator';
import type {
    NdCalculatorInput,
    NdCalculatorResult,
    NdIso,
    ShutterAngle,
} from '@/lib/nd-calculator';

export interface NdCalculatorState extends NdCalculatorInput {
    iso: NdIso;
    shutterAngle: ShutterAngle;
}

export interface NdCalculatorPreset {
    id: string;
    label: string;
    description: string;
    values: NdCalculatorState;
}

export const ND_CALCULATOR_PRESETS: NdCalculatorPreset[] = [
    {
        id: 'cinematic-24',
        label: '电影感 24p',
        description: '180° · ISO 100 · 薄云户外',
        values: {
            fps: 24,
            shutterAngle: 180,
            iso: 100,
            lighting: 'hazy_sun',
        },
    },
    {
        id: 'vlog-60',
        label: 'Vlog 60p',
        description: '180° · ISO 200 · 户外阴影',
        values: {
            fps: 60,
            shutterAngle: 180,
            iso: 200,
            lighting: 'open_shade',
        },
    },
    {
        id: 'noon-sun',
        label: '正午大太阳',
        description: '180° · ISO 100 · 烈日直射',
        values: {
            fps: 24,
            shutterAngle: 180,
            iso: 100,
            lighting: 'bright_sun',
        },
    },
    {
        id: 'indoor',
        label: '室内明亮',
        description: '180° · ISO 400 · 窗边',
        values: {
            fps: 30,
            shutterAngle: 180,
            iso: 400,
            lighting: 'indoor',
        },
    },
];

export function useNdCalculatorState(
    defaults: Partial<NdCalculatorState> = {},
) {
    const [state, setState] = useState<NdCalculatorState>({
        fps: defaults.fps ?? 24,
        lighting: defaults.lighting ?? 'bright_sun',
        iso: defaults.iso ?? 100,
        shutterAngle: defaults.shutterAngle ?? 180,
    });

    const result = useMemo(
        () => calculateNdRecommendation(state),
        [state],
    );

    const applyPreset = (preset: NdCalculatorPreset) => {
        setState(preset.values);
    };

    const patch = (partial: Partial<NdCalculatorState>) => {
        setState((current) => ({ ...current, ...partial }));
    };

    return { state, setState, patch, result, applyPreset };
}

export function useNdCalculatorFromSettings(
    resolution: string,
    ndFilter: string,
) {
    return useNdCalculatorState({
        fps: parseFpsFromResolution(resolution) ?? 24,
        lighting: inferLightingFromNdFilter(ndFilter),
        iso: 100,
        shutterAngle: 180,
    });
}

export type { NdCalculatorResult };

export { formatNdResultForCopy };
