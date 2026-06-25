import { Aperture } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm shadow-red-600/20">
                <Aperture className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    OSMO 内容中心
                </span>
                <span className="truncate text-[10px] leading-none text-sidebar-foreground/55">
                    Pocket 3 创作工作台
                </span>
            </div>
        </>
    );
}
