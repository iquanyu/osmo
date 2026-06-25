import { Head } from '@inertiajs/react';
import { ToolsPageShell } from '@/components/tools/tools-page-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ToolsSpecsPageProps } from '@/types';

export default function ToolsSpecs({ profiles }: ToolsSpecsPageProps) {
    return (
        <>
            <Head title="画质 / 续航" />
            <ToolsPageShell
                badge="Pocket 3 Cheat Sheet"
                title="画质 / 续航建议"
                description="把常见创作场景拆成可直接照着配的录像档案，快速查分辨率、帧率、色彩模式和收音搭配。"
            >
                <div className="grid gap-4 lg:grid-cols-2">
                    {profiles.map((profile) => (
                        <Card
                            key={profile.platform}
                            className="border-border/70 dark:border-border"
                        >
                            <CardHeader className="space-y-2">
                                <span className="inline-flex w-fit rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                                    {profile.platform}
                                </span>
                                <CardTitle className="text-base">
                                    {profile.resolution} · {profile.fps}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <SpecItem label="色彩模式" value={profile.color} />
                                    <SpecItem label="云台建议" value={profile.gimbal} />
                                    <SpecItem label="收音方式" value={profile.audio} />
                                    <SpecItem
                                        label="适合光线"
                                        value={profile.lightingCondition}
                                    />
                                </div>
                                <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs leading-6 text-muted-foreground">
                                    {profile.extraTips}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ToolsPageShell>
        </>
    );
}

function SpecItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-border bg-card/60 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
        </div>
    );
}
