import type { TutorialSettings } from '@/types';

interface Props {
    settings: TutorialSettings;
}

export function TutorialSettingsGrid({ settings }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/50 p-4 font-mono text-xs sm:grid-cols-4">
            <div>
                <span className="block text-[10px] uppercase text-muted-foreground">
                    建议分辨率值
                </span>
                <span className="text-xs font-bold text-foreground">
                    {settings.resolution}
                </span>
            </div>
            <div>
                <span className="block text-[10px] uppercase text-muted-foreground">
                    建议色彩空间
                </span>
                <span className="text-xs font-bold text-amber-400">
                    {settings.colorProfile}
                </span>
            </div>
            <div>
                <span className="block text-[10px] uppercase text-muted-foreground">
                    云台对焦防抖
                </span>
                <span className="text-xs font-bold text-red-400">
                    {settings.gimbalMode}
                </span>
            </div>
            <div>
                <span className="block text-[10px] uppercase text-muted-foreground">
                    磁吸减光镜建议
                </span>
                <span className="text-xs font-bold text-foreground">
                    {settings.ndFilter}
                </span>
            </div>
        </div>
    );
}
