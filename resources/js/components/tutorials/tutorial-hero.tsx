import { Link } from '@inertiajs/react';
import { ArrowRight, Flame, Tv, Volume2 } from 'lucide-react';
import { assistant as assistantRoute, simulator as simulatorRoute } from '@/routes';

export function TutorialHero() {
    return (
        <section className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black px-4 py-12 sm:px-6">
            <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-12">
                <div className="flex flex-col gap-4 md:col-span-7">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">
                        DJI Pocket 3 教程・官方与飞客共建
                    </span>
                    <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                        将这颗手持大底相机，配置出{' '}
                        <span className="text-red-500">真正的电影质感</span>
                    </h1>
                    <p className="max-w-xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
                        Osmo Pocket 3 不仅仅是个自拍杆！其旋转触摸屏幕、
                        <b>三轴硬件云台防抖、10-bit D-Log M 色彩</b>{' '}
                        孕育了媲美大型无反相机的摄制能力。点击下方教程或开启
                        <b>屏幕模拟器和 AI 拍摄助手</b>
                        ，直观理解每一位大师的参数秘密。
                    </p>
                    <div className="mt-2 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs">
                            <Flame className="h-4 w-4 text-red-500" />
                            <div>
                                <span className="block text-[10px] text-zinc-500">
                                    1" 大底传感器
                                </span>
                                <span className="font-mono font-bold text-white">
                                    主打暗光与虚化
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs">
                            <Volume2 className="h-4 w-4 text-emerald-500" />
                            <div>
                                <span className="block text-[10px] text-zinc-500">
                                    内置音质微调
                                </span>
                                <span className="font-mono font-bold text-white">
                                    DJI Mic 2 无线连
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs">
                            <Tv className="h-4 w-4 text-pink-500" />
                            <div>
                                <span className="block text-[10px] text-zinc-500">
                                    色域加持
                                </span>
                                <span className="font-mono font-bold text-white">
                                    10-bit D-Log M
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 md:col-span-5">
                    <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-400">
                        飞友极速通道
                    </h2>
                    <Link
                        href={simulatorRoute.url()}
                        className="group flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-left transition-all hover:border-zinc-700/80 hover:bg-zinc-900"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-900 bg-red-950 text-xs font-bold text-red-400 transition-transform group-hover:scale-105">
                                1
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-white">
                                    机身电子屏模拟器
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                    实操调节快门、D-Log、ND减光镜
                                </span>
                            </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-red-500" />
                    </Link>
                    <Link
                        href={assistantRoute.url()}
                        className="group flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-left transition-all hover:border-zinc-700/80 hover:bg-zinc-900"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-900 bg-red-950 text-xs font-bold text-red-400 transition-transform group-hover:scale-105">
                                2
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-white">
                                    AI 极限场景摄影顾问
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                    实时算好机位快门帧率组合
                                </span>
                            </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-red-500" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
