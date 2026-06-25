import { Link } from '@inertiajs/react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { community as communityRoute } from '@/routes';

export function TutorialCommunityCta() {
    return (
        <div className="border-b border-border bg-muted/20 px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4 text-red-500" />
                    <span>实操难题、参数讨论，去玩家社区看看飞友怎么说</span>
                </p>
                <Link
                    href={communityRoute.url()}
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-red-600 transition-colors hover:text-red-500 dark:text-red-400"
                >
                    进入社区
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
