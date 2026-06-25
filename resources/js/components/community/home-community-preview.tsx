import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Heart,
    MessageSquare,
    User,
} from 'lucide-react';
import { community as communityRoute } from '@/routes';
import { show as showCommunityPost } from '@/routes/community';
import type { CommunityListItem } from '@/types';

interface Props {
    posts: CommunityListItem[];
    hideCommunityLink?: boolean;
    title?: string;
}

export function HomeCommunityPreview({
    posts,
    hideCommunityLink = false,
    title = '社区热议',
}: Props) {
    if (posts.length === 0) {
        return null;
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-foreground uppercase">
                    <MessageSquare className="h-4 w-4 text-red-500" />
                    {title}
                </h2>
                {!hideCommunityLink && (
                    <Link
                        href={communityRoute.url()}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600 transition-colors hover:text-red-500 dark:text-red-400"
                    >
                        进入社区
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={showCommunityPost.url(post.id)}
                        className={`rounded-2xl border bg-card p-4 transition-colors hover:border-red-500/40 ${
                            post.pinned
                                ? 'border-red-900/40 bg-red-950/10'
                                : 'border-border'
                        }`}
                    >
                        <div className="mb-2 flex flex-wrap items-center gap-1.5">
                            {post.pinned && (
                                <span className="rounded border border-red-900/30 bg-red-950 px-2 py-0.5 text-[8.5px] font-bold tracking-tight text-red-400 uppercase">
                                    置顶
                                </span>
                            )}
                            {post.tags.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded border border-border bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h3 className="line-clamp-1 text-sm font-extrabold text-foreground">
                            {post.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {post.content}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[10px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{post.author}</span>
                                <span>·</span>
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {new Date(post.created_at).toLocaleDateString(
                                        'zh-CN',
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    {post.likes}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {post.answers_count}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
