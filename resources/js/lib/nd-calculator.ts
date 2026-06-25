/**
 * ND / 曝光计算器 — 数据与公式说明
 *
 * 公式（摄影通用）：
 * - 180° 快门：t = 快门角 / (360 × fps)
 * - 曝光 EV：log₂(N²/t) + log₂(ISO/100)
 *
 * 设备假设：
 * - Osmo Pocket 3 固定光圈 f/2.0（官方规格）
 *
 * 场景 EV 预设：摄影行业常见的经验参考（晴天 ~EV15、阴天 ~EV12 等），
 * 非 DJI 官方测光数据，未考虑雪地反光、D-Log 曝光策略等。
 *
 * ND 档位：ND8≈3 档、ND16≈4 档等为减光镜通用命名习惯；不同品牌实测可能有偏差。
 */
export type NdFps = 24 | 30 | 60 | 120;

export type NdLighting =
    | 'bright_sun'
    | 'hazy_sun'
    | 'overcast'
    | 'open_shade'
    | 'indoor'
    | 'low_light';

export type ShutterAngle = 90 | 180 | 270 | 360;

export type NdIso = 100 | 200 | 400 | 800 | 1600 | 3200;

export interface NdCalculatorInput {
    fps: NdFps;
    lighting: NdLighting;
    iso?: NdIso;
    shutterAngle?: ShutterAngle;
}

export interface NdFilterOption {
    label: string;
    stops: number;
    fits: boolean;
    headroom: number;
}

export interface NdCalculatorResult {
    fps: NdFps;
    lighting: NdLighting;
    iso: NdIso;
    shutterAngle: ShutterAngle;
    aperture: string;
    sceneEv: number;
    shutterSpeed: string;
    shutterDenominator: number;
    shutterSeconds: number;
    maxSceneEvWithoutNd: number;
    stopsNeeded: number;
    ndFilter: string;
    ndStops: number;
    alternativeNd: string | null;
    exposureStatus: 'ok' | 'need_nd' | 'overexposed' | 'underexposed';
    exposureLabel: string;
    filterOptions: NdFilterOption[];
    summary: string;
    tip: string;
    formulaNote: string;
}

export const POCKET3_APERTURE = 2.0;

export const ND_FPS_OPTIONS: { value: NdFps; label: string }[] = [
    { value: 24, label: '24 fps' },
    { value: 30, label: '30 fps' },
    { value: 60, label: '60 fps' },
    { value: 120, label: '120 fps' },
];

export const ND_ISO_OPTIONS: { value: NdIso; label: string }[] = [
    { value: 100, label: 'ISO 100' },
    { value: 200, label: 'ISO 200' },
    { value: 400, label: 'ISO 400' },
    { value: 800, label: 'ISO 800' },
    { value: 1600, label: 'ISO 1600' },
    { value: 3200, label: 'ISO 3200' },
];

export const SHUTTER_ANGLE_OPTIONS: {
    value: ShutterAngle;
    label: string;
    hint: string;
}[] = [
    { value: 90, label: '90°', hint: '更利落，运动更清晰' },
    { value: 180, label: '180°', hint: '电影感标准' },
    { value: 270, label: '270°', hint: '更柔和拖影' },
    { value: 360, label: '360°', hint: '极强动态模糊' },
];

export const ND_LIGHTING_OPTIONS: {
    value: NdLighting;
    label: string;
    ev: number;
    description: string;
}[] = [
    {
        value: 'bright_sun',
        label: '烈日直射',
        ev: 15,
        description: '晴天正午，海面/雪地等反光场景',
    },
    {
        value: 'hazy_sun',
        label: '薄云晴天',
        ev: 14,
        description: '有云层的高亮户外，仍易过曝',
    },
    {
        value: 'overcast',
        label: '阴天户外',
        ev: 12,
        description: '均匀散射光，光比柔和',
    },
    {
        value: 'open_shade',
        label: '户外阴影',
        ev: 11,
        description: '建筑物/树荫下的户外',
    },
    {
        value: 'indoor',
        label: '室内明亮',
        ev: 9,
        description: '窗边或充足室内照明',
    },
    {
        value: 'low_light',
        label: '室内弱光',
        ev: 6,
        description: '餐厅、夜景室内，慎用 ND',
    },
];

export const AVAILABLE_ND_FILTERS: { label: string; stops: number }[] = [
    { label: 'ND8', stops: 3 },
    { label: 'ND16', stops: 4 },
    { label: 'ND32', stops: 5 },
    { label: 'ND64', stops: 6 },
];

const LIGHTING_TIPS: Record<NdLighting, string> = {
    bright_sun:
        'Pocket 3 固定 F2.0，正午户外几乎必上 ND。优先保 180° 快门，不要靠抬高快门速度牺牲动态模糊。',
    hazy_sun:
        '薄云天气仍比想象中亮，若直方图右侧堆叠，优先加 ND 而非升 ISO。',
    overcast:
        '阴天光比小，ND8 往往够用；若使用 D-Log M 可留一点高光余量。',
    open_shade:
        '阴影区亮度接近阴天，通常 ND8 或无需滤镜即可压住快门。',
    indoor:
        '室内优先保证快门角度与帧率匹配，一般不需要 ND；过暗时升 ISO。',
    low_light:
        '弱光场景避免 ND。若快门已低于 180° 仍欠曝，升 ISO 或补光。',
};

export function shutterDenominatorForAngle(
    fps: NdFps,
    shutterAngle: ShutterAngle = 180,
): number {
    return Math.max(1, Math.round((360 * fps) / shutterAngle));
}

export function shutterSecondsFromDenominator(denominator: number): number {
    return 1 / denominator;
}

/** @deprecated Use shutterDenominatorForAngle */
export function shutterDenominatorForFps(fps: NdFps): number {
    return shutterDenominatorForAngle(fps, 180);
}

export function formatShutterSpeed(denominator: number): string {
    return `1/${denominator}`;
}

export function getLightingEv(lighting: NdLighting): number {
    return (
        ND_LIGHTING_OPTIONS.find((option) => option.value === lighting)?.ev ??
        12
    );
}

/**
 * 在固定光圈、ISO、快门下，场景 EV 上限（超过则需减光）。
 * EV = log2(N²/t) + log2(ISO/100)
 */
export function maxSceneEvWithoutNd(
    aperture: number,
    shutterSeconds: number,
    iso: NdIso,
): number {
    const evFromExposure =
        Math.log2((aperture * aperture) / shutterSeconds) +
        Math.log2(iso / 100);

    return Math.round(evFromExposure * 10) / 10;
}

export function pickNdFilter(stopsNeeded: number): {
    label: string;
    stops: number;
} {
    if (stopsNeeded <= 0) {
        return { label: 'None', stops: 0 };
    }

    const match = AVAILABLE_ND_FILTERS.find(
        (filter) => filter.stops >= stopsNeeded,
    );

    if (match) {
        return match;
    }

    return AVAILABLE_ND_FILTERS[AVAILABLE_ND_FILTERS.length - 1];
}

export function buildFilterOptions(stopsNeeded: number): NdFilterOption[] {
    return [
        { label: '无滤镜', stops: 0, fits: stopsNeeded <= 0, headroom: 0 },
        ...AVAILABLE_ND_FILTERS.map((filter) => ({
            label: filter.label,
            stops: filter.stops,
            fits: filter.stops >= stopsNeeded,
            headroom: filter.stops - stopsNeeded,
        })),
    ];
}

export function calculateNdRecommendation(
    input: NdCalculatorInput,
): NdCalculatorResult {
    const iso = input.iso ?? 100;
    const shutterAngle = input.shutterAngle ?? 180;
    const sceneEv = getLightingEv(input.lighting);

    const shutterDenominator = shutterDenominatorForAngle(
        input.fps,
        shutterAngle,
    );
    const shutterSeconds = shutterSecondsFromDenominator(shutterDenominator);
    const shutterSpeed = formatShutterSpeed(shutterDenominator);

    const maxEv = maxSceneEvWithoutNd(
        POCKET3_APERTURE,
        shutterSeconds,
        iso,
    );
    const stopsNeeded = Math.max(0, sceneEv - maxEv);
    const roundedStops = Math.round(stopsNeeded * 10) / 10;

    const picked = pickNdFilter(roundedStops);
    const filterOptions = buildFilterOptions(roundedStops);

    const insufficientFilters = AVAILABLE_ND_FILTERS.filter(
        (filter) => filter.stops < roundedStops,
    );
    const alternative =
        insufficientFilters.length > 0
            ? insufficientFilters[insufficientFilters.length - 1]
            : null;

    let exposureStatus: NdCalculatorResult['exposureStatus'];
    let exposureLabel: string;

    if (roundedStops <= 0) {
        exposureStatus = sceneEv < maxEv - 2 ? 'underexposed' : 'ok';
        exposureLabel =
            exposureStatus === 'underexposed'
                ? '环境偏暗，可考虑升 ISO'
                : '无需 ND，曝光余量充足';
    } else if (picked.stops < roundedStops) {
        exposureStatus = 'overexposed';
        exposureLabel = `所需约 ${roundedStops} 档减光，${picked.label} 仍可能略亮`;
    } else {
        exposureStatus = 'need_nd';
        exposureLabel = `需约 ${roundedStops} 档减光，推荐 ${picked.label}`;
    }

    const ndAdvice =
        picked.label === 'None'
            ? '无需加装 ND 滤镜'
            : `建议加装 ${picked.label} 磁吸减光镜（${picked.stops} 档）`;

    const angleHint =
        shutterAngle === 180
            ? '180° 电影感快门'
            : `${shutterAngle}° 快门角度`;

    return {
        fps: input.fps,
        lighting: input.lighting,
        iso,
        shutterAngle,
        aperture: `f/${POCKET3_APERTURE}`,
        sceneEv,
        shutterSpeed,
        shutterDenominator,
        shutterSeconds,
        maxSceneEvWithoutNd: maxEv,
        stopsNeeded: roundedStops,
        ndFilter: picked.label,
        ndStops: picked.stops,
        alternativeNd: alternative?.label ?? null,
        exposureStatus,
        exposureLabel,
        filterOptions,
        summary: `${angleHint}：${shutterSpeed}s @ ISO ${iso}，${ndAdvice}`,
        tip: LIGHTING_TIPS[input.lighting],
        formulaNote: `场景约 EV${sceneEv}，当前组合无 ND 可承载约 EV${maxEv}，差值 ${roundedStops} 档需靠减光镜吸收。`,
    };
}

export function parseFpsFromResolution(resolution: string): NdFps | null {
    const match = resolution.match(/(\d+)\s*fps/i);

    if (!match) {
        return null;
    }

    const fps = Number.parseInt(match[1], 10);

    if (fps === 24 || fps === 30 || fps === 60 || fps === 120) {
        return fps;
    }

    if (fps < 30) {
        return 24;
    }

    if (fps < 60) {
        return 30;
    }

    if (fps < 120) {
        return 60;
    }

    return 120;
}

export function inferLightingFromNdFilter(ndFilter: string): NdLighting {
    const normalized = ndFilter.trim().toUpperCase();

    if (normalized.includes('ND64') || normalized.includes('ND32')) {
        return 'bright_sun';
    }

    if (normalized.includes('ND16')) {
        return 'hazy_sun';
    }

    if (normalized.includes('ND8') || normalized.includes('ND4')) {
        return 'overcast';
    }

    return 'indoor';
}

export function formatNdResultForCopy(result: NdCalculatorResult): string {
    const lightingLabel =
        ND_LIGHTING_OPTIONS.find((option) => option.value === result.lighting)
            ?.label ?? result.lighting;

    const lines = [
        'Pocket 3 ND / 曝光计算（经验估算，非官方标定）',
        `帧率：${result.fps} fps · 快门角 ${result.shutterAngle}°`,
        `环境：${lightingLabel}（约 EV${result.sceneEv}）`,
        `光圈：${result.aperture}（固定）· ISO ${result.iso}`,
        `快门：${result.shutterSpeed}s`,
        `需减光：${result.stopsNeeded} 档`,
        `ND 滤镜：${result.ndFilter === 'None' ? '无需' : `${result.ndFilter}（${result.ndStops} 档）`}`,
        result.exposureLabel,
        result.formulaNote,
    ];

    if (result.alternativeNd) {
        lines.push(`备选（仍可能略亮）：${result.alternativeNd}`);
    }

    return lines.join('\n');
}
