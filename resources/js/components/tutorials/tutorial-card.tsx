import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, Star } from 'lucide-react';
import { show as showTutorialRoute } from '@/routes/tutorials';
import type { TutorialListItem } from '@/types';

function difficultyClass(difficulty: TutorialListItem['difficulty']): string {
    if (difficulty === '新手') {
        return 'bg-emerald-600 text-white';
    }

    if (difficulty === '进阶') {
        return 'bg-amber-600 text-black';
    }

    return 'bg-red-600 text-white';
}

interface Props {
    tutorial: TutorialListItem;
}

export function TutorialCard({ tutorial }: Props) {
    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                    src={tutorial.image}
                    alt={tutorial.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {tutorial.is_featured && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            推荐
                        </span>
                    )}
                    <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${difficultyClass(tutorial.difficulty)}`}
                    >
                        {tutorial.difficulty}
                    </span>
                    <span className="flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-xs">
                        <Clock className="h-2.5 w-2.5" />
                        {tutorial.duration}
                    </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="flex flex-grow flex-col justify-between gap-3 p-4">
                <div className="space-y-1.5">
                    <h3 className="text-sm leading-snug font-extrabold text-foreground transition-colors group-hover:text-red-400 sm:text-base">
                        {tutorial.title}
                    </h3>
                    <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {tutorial.summary}
                    </p>
                </div>
                <div className="flex flex-wrap gap-1 border-t border-border pt-3 md:gap-1.5">
                    <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                        🖥️ {tutorial.settings.resolution}
                    </span>
                    <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[9px] text-amber-500">
                        🎨 {tutorial.settings.colorProfile}
                    </span>
                </div>
                <Link
                    href={showTutorialRoute.url(tutorial.id)}
                    className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl border border-transparent bg-secondary py-2 text-[12px] font-semibold text-secondary-foreground transition-all hover:border-border hover:bg-secondary/80 hover:text-foreground"
                >
                    <span>阅读实操步骤</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        </div>
    );
}
