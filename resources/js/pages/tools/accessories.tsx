import { Head } from '@inertiajs/react';
import { ToolsPageShell } from '@/components/tools/tools-page-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ToolsAccessoriesPageProps } from '@/types';

export default function ToolsAccessories({
    accessories,
    communityPosts,
}: ToolsAccessoriesPageProps) {
    return (
        <>
            <Head title="配件红黑榜" />
            <ToolsPageShell
                badge="Field Setup"
                title="配件红黑榜"
                description="按真实外拍场景整理 Pocket 3 常见配件建议，先帮你避坑，再给你一套更轻、更稳、更能出片的搭配思路。"
            >
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                    <div className="grid gap-4 md:grid-cols-2">
                        {accessories.map((accessory) => (
                            <Card
                                key={accessory.name}
                                className="border-border/70 dark:border-border"
                            >
                                <CardHeader className="space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {accessory.category}
                                        </span>
                                        <span
                                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                                                accessory.recommendation === '推荐'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                            }`}
                                        >
                                            {accessory.recommendation}
                                        </span>
                                    </div>
                                    <CardTitle className="text-base">
                                        {accessory.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm leading-6 text-muted-foreground">
                                    {accessory.reason}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-border/70 dark:border-border">
                        <CardHeader>
                            <CardTitle className="text-base">
                                社区常见讨论
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {communityPosts.map((post) => (
                                <div
                                    key={post.title}
                                    className="rounded-xl border border-border bg-muted/20 p-3"
                                >
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-600 dark:text-red-400">
                                            {post.tag}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-foreground">
                                        {post.title}
                                    </h3>
                                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                                        {post.summary}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </ToolsPageShell>
        </>
    );
}
