import { Link } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid min-h-svh flex-col lg:grid-cols-2">
            <div className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-white lg:flex">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(220,38,38,0.15),transparent_50%)]" />

                <Link
                    href="/tutorials"
                    className="relative z-20 flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white">
                        <Camera className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="block text-lg font-bold tracking-tight">
                            DJI Pocket 3
                        </span>
                        <span className="text-xs text-zinc-400">
                            视频拍摄大师实操网
                        </span>
                    </div>
                </Link>

                <div className="relative z-20 space-y-4">
                    <p className="text-2xl font-semibold leading-snug tracking-tight">
                        学习拍摄参数
                        <br />
                        创作更好的视频
                    </p>
                    <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
                        教程库、参数模拟器与玩家社区，助你快速上手 Pocket 3
                        拍摄技巧。
                    </p>
                </div>

                <p className="relative z-20 text-xs text-zinc-500">
                    © {new Date().getFullYear()} Osmo Creator Platform
                </p>
            </div>

            <div className="flex flex-col bg-background">
                <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 lg:hidden" />

                <div className="flex flex-1 items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-sm space-y-8">
                        <Link
                            href="/tutorials"
                            className="flex items-center justify-center gap-2 lg:hidden"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white">
                                <Camera className="h-5 w-5" />
                            </div>
                            <span className="font-bold tracking-tight">
                                DJI Pocket 3
                            </span>
                        </Link>

                        <div className="space-y-2 text-center lg:text-left">
                            <h1 className="text-xl font-bold tracking-tight">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
