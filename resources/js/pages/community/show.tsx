import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Heart,
    Loader2,
    MessageSquare,
    Send,
    ShieldCheck,
    User,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { community as communityRoute } from '@/routes';
import { answer as answerCommunityPost, like as likeCommunityPost } from '@/routes/community';
import type { CommunityShowPageProps } from '@/types';

export default function CommunityShow({ post }: CommunityShowPageProps) {
    const page = usePage().props as {
        auth?: {
            user?: {
                name?: string | null;
            } | null;
        };
        errors?: {
            author?: string;
            content?: string;
        };
    };
    const authUser = page.auth?.user ?? null;
    const errors = page.errors ?? {};
    const [answerAuthor, setAnswerAuthor] = useState('');
    const [answerContent, setAnswerContent] = useState('');
    const [isAnswerLoading, setIsAnswerLoading] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    const handleLike = () => {
        setIsLikeLoading(true);
        router.post(
            likeCommunityPost.url(post.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsLikeLoading(false),
            },
        );
    };

    const handleAddAnswer = () => {
        if (!answerContent.trim()) {
            return;
        }

        setIsAnswerLoading(true);
        router.post(
            answerCommunityPost.url(post.id),
            { author: answerAuthor, content: answerContent },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsAnswerLoading(false);
                    setAnswerContent('');
                },
            },
        );
    };

    return (
        <>
            <Head title={post.title} />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                <Link
                    href={communityRoute.url()}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    返回社区
                </Link>

                <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border p-6">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            {post.pinned && (
                                <span className="rounded border border-red-900/30 bg-red-950 px-2 py-0.5 text-[8.5px] font-bold tracking-tight text-red-400 uppercase">
                                    置顶精选
                                </span>
                            )}
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded border border-border bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
                                    {post.title}
                                </h1>
                                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />
                                        {post.author}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(post.created_at).toLocaleString(
                                            'zh-CN',
                                        )}
                                    </span>
                                    <span>{post.views} 浏览</span>
                                </div>
                            </div>
                            <div
                                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${post.avatar_color}`}
                            >
                                {post.author.slice(0, 1)}
                            </div>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                            {post.content}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handleLike}
                                disabled={isLikeLoading}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-500 disabled:opacity-50"
                            >
                                {isLikeLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Heart className="h-4 w-4" />
                                )}
                                {post.likes} 赞
                            </button>
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MessageSquare className="h-4 w-4" />
                                {post.answers.length} 条解答
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 p-6">
                        <div className="rounded-2xl border border-red-500/20 bg-red-950/8 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">
                                下一步
                            </p>
                            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-sm font-semibold text-foreground">
                                        先看大家怎么解，再补你的实战经验
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        这页最有价值的不是点个赞，而是把你遇到的问题和解法补进来。
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        document
                                            .getElementById('community-answer-form')
                                            ?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'center',
                                            });
                                    }}
                                    className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-background px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-950/15"
                                >
                                    直接去写解答
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-sm font-bold tracking-wider text-red-500 uppercase">
                                玩家与专家解答
                            </h2>
                            <span className="text-xs text-muted-foreground">
                                共 {post.answers.length} 条
                            </span>
                        </div>

                        {post.answers.length === 0 ? (
                            <p className="rounded-xl border border-border bg-muted/50 p-4 text-xs text-muted-foreground italic">
                                暂无玩家解答，欢迎在下方填写您的大疆实操心得。
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {post.answers.map((answer) => (
                                    <div
                                        key={answer.id}
                                        className={`rounded-xl border p-4 ${
                                            answer.is_official
                                                ? 'border-red-900/50 bg-red-950/10'
                                                : 'border-border bg-muted/50'
                                        }`}
                                    >
                                        <div className="mb-2 flex items-center justify-between text-[10px] text-muted-foreground">
                                            <span className="flex items-center gap-1 font-bold text-foreground">
                                                {answer.is_official && (
                                                    <ShieldCheck className="h-3 w-3 text-red-500" />
                                                )}
                                                {answer.author}
                                                {answer.is_official && (
                                                    <span className="rounded border border-red-900/30 bg-red-950 px-1.5 py-0.5 text-[8px] text-red-400">
                                                        官方认证
                                                    </span>
                                                )}
                                            </span>
                                            <span>
                                                {new Date(
                                                    answer.created_at,
                                                ).toLocaleString('zh-CN')}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                            {answer.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div
                            id="community-answer-form"
                            className="rounded-2xl border border-border bg-muted/20 p-4"
                        >
                            <h3 className="mb-3 text-xs font-bold text-foreground">
                                提交解答
                            </h3>
                            <p className="mb-3 text-xs text-muted-foreground">
                                先写你自己的场景、设置和结论，其他玩家会更容易直接照着试。
                            </p>
                            {authUser?.name ? (
                                <p className="mb-3 text-xs text-muted-foreground">
                                    当前默认会以「{authUser.name}」身份发布，留空笔名也能直接提交。
                                </p>
                            ) : null}
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="space-y-1 sm:w-1/4">
                                    <input
                                        type="text"
                                        placeholder={
                                            authUser?.name
                                                ? `默认：${authUser.name}`
                                                : '您的笔名...'
                                        }
                                        value={answerAuthor}
                                        onChange={(event) =>
                                            setAnswerAuthor(event.target.value)
                                        }
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-red-600 focus:outline-none"
                                    />
                                    <InputError message={errors.author} className="text-xs" />
                                </div>
                                <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                                    <div className="flex-1 space-y-1">
                                        <input
                                            type="text"
                                            placeholder="我来解答他的技术难点..."
                                            value={answerContent}
                                            onChange={(event) =>
                                                setAnswerContent(event.target.value)
                                            }
                                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-red-600 focus:outline-none"
                                        />
                                        <InputError message={errors.content} className="text-xs" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddAnswer}
                                        disabled={
                                            isAnswerLoading ||
                                            !answerContent.trim()
                                        }
                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-40"
                                    >
                                        {isAnswerLoading ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <Send className="h-3.5 w-3.5" />
                                        )}
                                        提交
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </>
    );
}
