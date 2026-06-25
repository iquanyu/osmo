interface Props {
    tips: string[];
}

export function TutorialTipsCallout({ tips }: Props) {
    if (tips.length === 0) {
        return null;
    }

    return (
        <div className="flex gap-3 rounded-2xl border border-amber-900/50 bg-amber-950/20 p-4 text-xs sm:text-sm">
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-amber-900 bg-amber-950 text-xs font-bold text-amber-500">
                !
            </div>
            <div>
                <span className="mb-1 block font-bold text-amber-400">
                    避坑/专家心得提示：
                </span>
                <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                    {tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
