import { Layers } from 'lucide-react';

interface Props {
    steps: string[];
}

export function TutorialStepList({ steps }: Props) {
    return (
        <div className="space-y-4">
            <h3 className="flex items-center gap-2 border-b border-border pb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                <Layers className="h-4 w-4 text-red-500" />
                <span>实操分步指南：</span>
            </h3>
            <ol className="space-y-3.5">
                {steps.map((step, idx) => {
                    const colonIdx = step.indexOf('：');
                    const heading =
                        colonIdx > -1 ? step.substring(0, colonIdx) : '';
                    const body =
                        colonIdx > -1 ? step.substring(colonIdx + 1) : step;

                    return (
                        <li
                            key={idx}
                            className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-3.5"
                        >
                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-red-900 bg-red-950 font-mono text-xs font-bold text-red-400">
                                {idx + 1}
                            </span>
                            <div className="text-xs sm:text-sm">
                                {heading ? (
                                    <>
                                        <strong className="mb-1 block font-bold text-foreground sm:mb-0 sm:mr-1.5 sm:inline">
                                            {heading}：
                                        </strong>
                                        <span className="leading-relaxed text-muted-foreground">
                                            {body}
                                        </span>
                                    </>
                                ) : (
                                    <span className="leading-relaxed text-muted-foreground">
                                        {step}
                                    </span>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
