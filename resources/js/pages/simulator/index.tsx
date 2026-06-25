import { Head } from '@inertiajs/react';
import { CheckCircle, Disc, Info, ShieldAlert, Sliders, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SimulatorHardwareSpecs } from '@/components/simulator/simulator-hardware-specs';
import { SimulatorKnowledgeTips } from '@/components/simulator/simulator-knowledge-tips';
import { SimulatorPresetReference } from '@/components/simulator/simulator-preset-reference';
import type { CreatorPreset, PocketSpec } from '@/types';

interface Props {
    creatorPresets: CreatorPreset[];
    generalSpecs: PocketSpec[];
}

export default function SimulatorIndex({ creatorPresets, generalSpecs }: Props) {
    const [resolution, setResolution] = useState<string>('4K 24fps');
    const [colorProfile, setColorProfile] = useState<string>('D-Log M');
    const [applyLut, setApplyLut] = useState<boolean>(true);
    const [iso, setIso] = useState<number>(100);
    const [shutterSpeed, setShutterSpeed] = useState<string>('1/50');
    const [gimbalMode, setGimbalMode] = useState<string>('Follow');
    const [ndFilter, setNdFilter] = useState<string>('ND16');

    const applyPreset = (platform: string) => {
        const preset = creatorPresets.find((item) => item.platform === platform);
        const settings = preset?.simulatorSettings;

        if (!settings) {
            return;
        }

        setResolution(settings.resolution);
        setColorProfile(settings.colorProfile);
        setApplyLut(settings.applyLut);
        setShutterSpeed(settings.shutterSpeed);
        setIso(settings.iso);
        setNdFilter(settings.ndFilter);
        setGimbalMode(settings.gimbalMode);
    };

    const [tilt, setTilt] = useState<number>(0);
    const [ballPos, setBallPos] = useState({ x: 0, dx: 3 });

    useEffect(() => {
        let animationFrameId: number;
        const updateBall = () => {
            setBallPos((prev) => {
                let nX = prev.x + prev.dx;
                let nDx = prev.dx;

                if (nX > 90 || nX < -90) {
                    nDx = -prev.dx;
                    nX = prev.x + nDx;
                }

                return { x: nX, dx: nDx };
            });
            animationFrameId = requestAnimationFrame(updateBall);
        };
        updateBall();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const trail = useMemo(() => {
        let trailCount = 5;

        if (shutterSpeed === '1/50') {
            trailCount = 8;
        } else if (shutterSpeed === '1/120') {
            trailCount = 4;
        } else if (shutterSpeed === '1/1000') {
            trailCount = 1;
        }

        const newTrail: { x: number; opacity: number }[] = [];

        for (let i = 0; i < trailCount; i++) {
            const offset = (ballPos.dx > 0 ? -1 : 1) * i * 3;
            newTrail.push({
                x: ballPos.x + offset,
                opacity: ((trailCount - i) / trailCount) * 0.5,
            });
        }

        return newTrail;
    }, [ballPos.x, ballPos.dx, shutterSpeed]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;

        if (gimbalMode === 'FPV') {
            setTilt(x * 0.12);
        } else if (gimbalMode === 'Follow') {
            setTilt(x * 0.04);
        } else {
            setTilt(0);
        }
    };

    const handleMouseLeave = () => {
        setTilt(0);
    };

    const getPreviewStyles = () => {
        let filter = '';

        if (colorProfile === 'D-Log M') {
            if (applyLut) {
                filter = 'contrast-115 saturate-125 sepia-[5%] hue-rotate-[2deg]';
            } else {
                filter = 'contrast-75 saturate-60 brightness-110';
            }
        } else if (colorProfile === 'HLG') {
            filter = 'contrast-110 saturate-110 brightness-105 shadow-2xl';
        } else {
            filter = 'contrast-100 saturate-100';
        }

        return { filter };
    };

    const previewStyles = getPreviewStyles();

    const getExpertReview = () => {
        if (colorProfile === 'D-Log M' && !applyLut) {
            return {
                type: 'warning',
                title: 'D-Log M 原始发灰状态',
                desc: '此时画面发灰是正常的，正是 10-bit 无损色彩带来的超高后期容载度。您可以开启「后期3D-LUT预览」一键恢复通透电影光影。',
            };
        }

        if (ndFilter === 'None' && shutterSpeed === '1/50' && resolution.includes('24fps')) {
            return {
                type: 'danger',
                title: '极强日光下快门过慢，画面有曝光过度溢出风险',
                desc: '1/50秒对应24帧是完美的电影比例！但是在正午或晴天下由于光圈固定f/2.0，会导致亮部彻底死白。请立刻加套「ND16 减光镜」解决。',
            };
        }

        if (iso >= 3200) {
            return {
                type: 'warning',
                title: 'ISO 值偏高，面部及天空可能包含颗粒噪底',
                desc: '大感光带来了更明亮的视野，但也拉高了暗部噪声。夜晚请尽量开启专门的「低光视频」模式，或使用固定三轴脚架锁死 ISO 100 录像。',
            };
        }

        if (shutterSpeed === '1/1000') {
            return {
                type: 'info',
                title: '快门时间极小，丢失自然动态模糊',
                desc: '超快快门适合凝固飞鸟或赛车细节，但是在常规漫游拍摄时，会使画面动作看起来极其生硬，不符合 180 度快门法则的视觉残留习惯。',
            };
        }

        return {
            type: 'success',
            title: '色彩与曝光的卓越平衡组合！',
            desc: '当前帧率、快门和磁吸滤镜配合完美，极佳的动态细节与顺滑的动态残影能直出标准的 10-bit 大电影质感。',
        };
    };

    const review = getExpertReview();

    return (
        <>
            <Head title="参数模拟器" />
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div id="manual-simulator-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Simulation Screen */}
                    <div className="lg:col-span-7 flex flex-col items-center">
                        <h3 className="text-lg font-bold mb-3 text-red-500 self-start flex items-center gap-2">
                            <Disc className="w-4 h-4 animate-pulse text-red-600" />
                            Pocket 3 屏幕联动模拟器
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 self-start">
                            控制右方转盘参数，并可将鼠标移至屏幕上方左右滑动，体验 <b>云台平衡跟随、ISO底噪声、180快门模糊、大底虚化</b> 各自的成片质感差异。
                        </p>

                        {/* OLED Handheld Screen Housing - kept dark to simulate a real camera screen */}
                        <div
                            className="relative w-full max-w-lg aspect-[16/10] bg-zinc-950 p-4 rounded-3xl border border-zinc-800 shadow-2xl transition-all duration-300 select-none cursor-pointer"
                            style={{ transform: `rotate(${tilt}deg)` }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Bezel frame screen */}
                            <div className="relative w-full h-full bg-black rounded-xl overflow-hidden border border-zinc-900">
                                {/* Real World Backdrop image */}
                                <div
                                    className={`relative w-full h-full bg-cover bg-center transition-all duration-300 ${previewStyles.filter}`}
                                    style={{
                                        backgroundImage:
                                            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80')",
                                        filter: `${previewStyles.filter} ${ndFilter === 'None' ? 'brightness(1.2)' : 'brightness(0.95)'}`,
                                    }}
                                >
                                    {/* Noise Grain simulator */}
                                    {iso >= 1600 && (
                                        <div
                                            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen bg-repeat"
                                            style={{
                                                backgroundImage:
                                                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                                                animation: 'noise 0.15s infinite',
                                            }}
                                        />
                                    )}

                                    {/* Beach Light Flare */}
                                    {ndFilter === 'None' && (
                                        <div className="absolute inset-0 bg-white/20 pointer-events-none mix-blend-overlay transition-opacity" />
                                    )}

                                    {/* Moving sports car/ball */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="relative w-full max-w-xs h-24 flex items-center">
                                            {/* Sun source element */}
                                            <div className="absolute top-1 left-2 text-yellow-400 bg-black/40 px-1.5 py-0.5 rounded-full flex items-center gap-1 text-[9px] font-semibold">
                                                <Sun className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: '20s' }} />
                                                <span>正午直射光</span>
                                            </div>

                                            {/* Trails motion blur simulation */}
                                            {trail.map((t, idx) => (
                                                <div
                                                    key={idx}
                                                    className="absolute w-6 h-6 rounded-full bg-white/30"
                                                    style={{
                                                        transform: `translateX(calc(120px + ${t.x}px))`,
                                                        opacity: t.opacity,
                                                        filter: shutterSpeed === '1/1000' ? 'none' : 'blur(3px)',
                                                    }}
                                                />
                                            ))}

                                            {/* Subject */}
                                            <div
                                                className="absolute w-6 h-6 rounded-full bg-red-600 shadow-md flex items-center justify-center text-white text-[8px] font-mono border border-white font-bold"
                                                style={{ transform: `translateX(calc(120px + ${ballPos.x}px))` }}
                                            >
                                                REC
                                            </div>

                                            {/* Grid Lines */}
                                            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none">
                                                <div className="border-r border-b border-white border-dashed"></div>
                                                <div className="border-r border-b border-white border-dashed"></div>
                                                <div className="border-b border-white border-dashed"></div>
                                                <div className="border-r border-b border-white border-dashed"></div>
                                                <div className="border-r border-b border-white border-dashed"></div>
                                                <div className="border-b border-white border-dashed"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DJI HUD layer - Top Row */}
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-2.5 flex justify-between items-center text-[10px] font-mono text-white pointer-events-none">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                            <span>02:18:43</span>
                                        </div>
                                        <div className="bg-red-950/80 text-red-400 border border-red-900/40 px-1 rounded text-[9px] scale-90">
                                            物理镜: {ndFilter === 'None' ? '不带滤镜' : ndFilter}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>94%</span>
                                            <div className="w-3 h-2 bg-emerald-500 rounded-sm border border-white/20" />
                                        </div>
                                    </div>

                                    {/* Bottom HUD bar */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 flex justify-between items-end text-[10px] font-mono text-white pointer-events-none">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-amber-400 font-bold">{resolution}</span>
                                            <div className="flex gap-1 text-[9px]">
                                                <span className="bg-zinc-800 px-1 rounded">{colorProfile}</span>
                                                {colorProfile === 'D-Log M' && (
                                                    <span className={`px-1 rounded ${applyLut ? 'bg-orange-600' : 'bg-zinc-700 text-zinc-400'}`}>
                                                        {applyLut ? '套LUT' : '灰片原色彩'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right text-[9px] leading-relaxed">
                                            <div>快门: {shutterSpeed}s</div>
                                            <div>感光: ISO {iso}</div>
                                            <div className="text-red-400">
                                                稳定器: {gimbalMode === 'Follow' ? '全智能跟着' : gimbalMode === 'Locked' ? '俯仰锁定' : 'FPV 全视角'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Live Expert Audit Evaluation */}
                        <div
                            className={`mt-5 w-full max-w-lg p-4 rounded-2xl border flex gap-3 text-xs leading-relaxed ${
                                review.type === 'success'
                                    ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-300'
                                    : review.type === 'warning'
                                      ? 'bg-amber-950/20 border-amber-900/60 text-amber-300'
                                      : review.type === 'danger'
                                        ? 'bg-red-950/20 border-red-900/60 text-red-300'
                                        : 'bg-blue-950/20 border-blue-900/60 text-blue-300'
                            }`}
                        >
                            <div className="mt-0.5">
                                {review.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                {review.type === 'warning' && <Info className="w-4 h-4 text-amber-500" />}
                                {review.type === 'danger' && <ShieldAlert className="w-4 h-4 text-red-500" />}
                                {review.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                            </div>
                            <div>
                                <h4 className="font-extrabold mb-0.5 text-foreground">{review.title}</h4>
                                <p className="text-[11px] text-muted-foreground">{review.desc}</p>
                            </div>
                        </div>
                    </div>

                    {/* Manual Control Grips: 5 cols */}
                    <div className="lg:col-span-5 bg-card p-5 rounded-2xl border border-border flex flex-col gap-5">
                        <h3 className="font-bold text-xs uppercase text-muted-foreground tracking-wider border-b border-border pb-2 flex justify-between items-center">
                            <span>相机物理调节面板</span>
                            <span className="text-[9px] text-red-500 font-mono tracking-normal bg-red-950/60 px-1.5 py-0.5 rounded-md border border-red-900/40">
                                MASTER
                            </span>
                        </h3>

                        {/* Creator Specs Presets Quick Load */}
                        <div className="bg-muted/60 border border-border p-3 rounded-xl">
                            <label className="text-muted-foreground text-[10px] block font-extrabold mb-2 uppercase tracking-wider text-red-500 flex items-center gap-1">
                                <Sliders className="w-3 h-3" />
                                <span>极速导入创作者实操预设</span>
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {creatorPresets.map((p) => (
                                    <button
                                        key={p.platform}
                                        type="button"
                                        onClick={() => applyPreset(p.platform)}
                                        className="bg-background hover:bg-accent hover:text-foreground border border-border text-muted-foreground p-2 rounded-lg text-left transition-all hover:border-red-900/50 cursor-pointer flex flex-col gap-0.5"
                                    >
                                        <span className="font-bold text-[10px] text-foreground block">{p.platform}</span>
                                        <span className="text-[8px] text-muted-foreground truncate">
                                            {p.resolution} • {p.color.split(' ')[0]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Res & FPS */}
                        <div>
                            <label className="text-muted-foreground text-[10px] block font-bold mb-1.5 uppercase">
                                分辨率与帧配置
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {['4K 24fps', '4K 60fps', '1080p 120fps'].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setResolution(v)}
                                        className={`py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                                            resolution === v
                                                ? 'bg-red-600 border-red-500 text-white'
                                                : 'bg-background border-border text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Profiles */}
                        <div>
                            <label className="text-muted-foreground text-[10px] block font-bold mb-1.5 uppercase">
                                色域与色彩模式
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {['Normal 8-bit', 'D-Log M', 'HLG'].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setColorProfile(v)}
                                        className={`py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                                            colorProfile === v
                                                ? 'bg-red-600 border-red-500 text-white'
                                                : 'bg-background border-border text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                            {colorProfile === 'D-Log M' && (
                                <div className="mt-2 text-[10px] bg-background p-2 rounded-lg border border-border flex items-center justify-between">
                                    <span className="text-muted-foreground">机内 LUT 后期一键调色</span>
                                    <button
                                        onClick={() => setApplyLut(!applyLut)}
                                        className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                                            applyLut ? 'bg-orange-600 text-white' : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {applyLut ? '已还原 Rec709' : '原始灰片色彩'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Shutter Speeds */}
                        <div>
                            <label className="text-muted-foreground text-[10px] block font-bold mb-1.5 uppercase">
                                快门档速门限
                            </label>
                            <div className="grid grid-cols-4 gap-1.5">
                                {['Auto', '1/50', '1/120', '1/1000'].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setShutterSpeed(v)}
                                        className={`py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                                            shutterSpeed === v
                                                ? 'bg-amber-600 border-amber-500 text-black'
                                                : 'bg-background border-border text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {v === 'Auto' ? '自动' : v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ISO sensitiveness */}
                        <div>
                            <label className="text-muted-foreground text-[10px] block font-bold mb-1.5 uppercase">
                                感光度上限 (ISO)
                            </label>
                            <div className="grid grid-cols-5 gap-1.5">
                                {[100, 400, 1600, 3200, 6400].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setIso(v)}
                                        className={`py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                                            iso === v
                                                ? 'bg-amber-600 border-amber-500 text-black'
                                                : 'bg-background border-border text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Magnetic ND Filters */}
                        <div>
                            <label className="text-muted-foreground text-[10px] block font-bold mb-1.5 uppercase">
                                磁吸减光镜 (ND镜规格)
                            </label>
                            <div className="grid grid-cols-4 gap-1.5">
                                {['None', 'ND8', 'ND16', 'ND64'].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setNdFilter(v)}
                                        className={`py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                                            ndFilter === v
                                                ? 'bg-foreground border-foreground text-background'
                                                : 'bg-background border-border text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {v === 'None' ? '不挂镜' : v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gimbal Balance mode */}
                        <div>
                            <label className="text-muted-foreground text-[10px] block font-bold mb-1.5 uppercase">
                                云台对焦稳定方向轴
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {['Follow', 'Locked', 'FPV'].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setGimbalMode(v)}
                                        className={`py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                                            gimbalMode === v
                                                ? 'bg-red-600 border-red-500 text-white'
                                                : 'bg-background border-border text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {v === 'Follow' ? '智能跟从' : v === 'Locked' ? '俯仰锁存' : 'FPV 旋转'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <SimulatorHardwareSpecs generalSpecs={generalSpecs} />
                    </div>
                    <div className="lg:col-span-7">
                        <SimulatorPresetReference
                            creatorPresets={creatorPresets}
                            onApplyPreset={applyPreset}
                        />
                    </div>
                </section>

                <SimulatorKnowledgeTips />
            </div>
        </>
    );
}
