import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Heart,
    Loader2,
    MessageSquare,
    Send,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { HomeCommunityPreview } from '@/components/community/home-community-preview';
import {
    like as likeCommunityPost,
    show as showCommunityPost,
    store as storeCommunityPost,
} from '@/routes/community';
import type { CommunityIndexPageProps } from '@/types';

export default function CommunityIndex({
    posts,
    hotCommunityPosts,
    filters,
}: CommunityIndexPageProps) {
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('新手提问');
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [likingPostId, setLikingPostId] = useState<number | null>(null);

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            return;
        }

        setIsSubmitLoading(true);
        router.post(
            storeCommunityPost.url(),
            { author, title, content, tags },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsSubmitLoading(false);
                    setTitle('');
                    setContent('');
                    setTags('新手提问');
                },
            },
        );
    };

    const handleLikePost = (postId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLikingPostId(postId);
        router.post(
            likeCommunityPost.url(postId),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setLikingPostId(null),
            },
        );
    };

    return (
        <>
            <Head title="玩家社区" />
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                {!filters.q && hotCommunityPosts.length > 0 && (
                    <div className="mb-10">
                        <HomeCommunityPreview
                            posts={hotCommunityPosts}
                            hideCommunityLink
                            title="热门讨论"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="flex flex-col gap-4 lg:col-span-7">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-base font-bold text-foreground sm:text-lg">
                                <MessageSquare className="h-5 w-5 text-red-500" />
                                <span>Pocket 3 玩家问答互动沙龙</span>
                            </h3>
                            <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                {posts.length} 个活跃玩家会话
                            </span>
                        </div>

                        {posts.length === 0 ? (
                            <div className="rounded-2xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
                                {filters.q
                                    ? '没有找到匹配的帖子，试试其他关键词。'
                                    : '暂无玩家提问，快用右侧表单提交第一个 Pocket 3 的实操难题吧！'}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {posts.map((post) => (
                                    <article
                                        key={post.id}
                                        className={`rounded-2xl border bg-card p-4 transition-all hover:border-primary/40 ${
                                            post.pinned
                                                ? 'border-red-900/40 bg-red-950/10'
                                                : 'border-border'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                                                    {post.pinned && (
                                                        <span className="rounded border border-red-900/30 bg-red-950 px-2 py-0.5 text-[8.5px] font-bold tracking-tight text-red-400 uppercase">
                                                            置顶精选
                                                        </span>
                                                    )}
                                                    {post.tags?.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded border border-border bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <Link
                                                    href={showCommunityPost.url(
                                                        post.id,
                                                    )}
                                                    className="text-sm leading-snug font-extrabold text-foreground transition-colors hover:text-red-500 sm:text-base"
                                                >
                                                    {post.title}
                                                </Link>
                                            </div>
                                            <div
                                                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white uppercase ${post.avatar_color}`}
                                            >
                                                {post.author.slice(0, 1)}
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                            {post.content}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px] text-muted-foreground sm:text-[11px]">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                <span>{post.author}</span>
                                                <span className="mx-1">•</span>
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {new Date(
                                                        post.created_at,
                                                    ).toLocaleDateString(
                                                        'zh-CN',
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={(e) =>
                                                        handleLikePost(
                                                            post.id,
                                                            e,
                                                        )
                                                    }
                                                    disabled={
                                                        likingPostId ===
                                                        post.id
                                                    }
                                                    className="flex cursor-pointer items-center gap-1 text-muted-foreground transition-colors hover:text-red-500"
                                                >
                                                    {likingPostId ===
                                                    post.id ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        <Heart className="h-3.5 w-3.5" />
                                                    )}
                                                    <span>{post.likes} 赞</span>
                                                </button>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                    <span>
                                                        {post.answers_count}{' '}
                                                        解答
                                                    </span>
                                                </span>
                                                <Link
                                                    href={showCommunityPost.url(
                                                        post.id,
                                                    )}
                                                    className="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                                                >
                                                    查看
                                                    <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="self-start rounded-2xl border border-border bg-card p-5 lg:col-span-5">
                        <h4 className="mb-4 flex items-center gap-2 border-b border-border pb-2 text-sm font-semibold text-foreground">
                            <MessageSquare className="h-4 w-4 text-red-500" />
                            <span>提问大疆干货社区</span>
                        </h4>
                        <p className="mb-4 text-[11px] leading-relaxed text-muted-foreground">
                            如果您在夜景降噪、D-Log
                            色彩还原、配件 Mic2 连结、物理 ND
                            镜片选择上有不解，欢迎发表求助，大师与官方会提供解答。
                        </p>
                        <form
                            onSubmit={handleCreatePost}
                            className="flex flex-col gap-4 text-xs"
                        >
                            <div>
                                <label className="mb-1 block font-bold text-muted-foreground">
                                    玩家称呼
                                </label>
                                <input
                                    type="text"
                                    placeholder="例如：Pocket3画质追求者"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-red-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-bold text-muted-foreground">
                                    问题标题{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="例如：阳光直下套 LUT 为什么画面还是暗淡？"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-red-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-bold text-muted-foreground">
                                    描述您的环境细节与错误现象{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="您是在白天大照度还是暗光下拍摄？"
                                    value={content}
                                    onChange={(e) =>
                                        setContent(e.target.value)
                                    }
                                    className="w-full resize-none rounded-xl border border-border bg-background p-2.5 text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-red-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-bold text-muted-foreground">
                                    说明标签 (空格区分)
                                </label>
                                <input
                                    type="text"
                                    placeholder="例如：色彩 减光镜 FPV 音质"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-red-600 focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={
                                    isSubmitLoading ||
                                    !title.trim() ||
                                    !content.trim()
                                }
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 font-semibold text-white transition-all hover:bg-red-500 disabled:opacity-40"
                            >
                                {isSubmitLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        <span>发表提问 / 求解专家</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
