import { ExternalLink } from 'lucide-react';
import { ND_CALCULATOR_REFERENCES } from '@/lib/nd-calculator-references';

const linkClassName =
    'underline decoration-muted-foreground/40 underline-offset-2 transition-colors hover:text-foreground hover:decoration-foreground/60';

export function NdCalculatorReferences({
    compact = false,
}: {
    compact?: boolean;
}) {
    if (compact) {
        return (
            <p className="text-[10px] leading-relaxed text-muted-foreground">
                参考：
                {ND_CALCULATOR_REFERENCES.map((ref, index) => (
                    <span key={ref.href}>
                        {index > 0 && ' · '}
                        <a
                            href={ref.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClassName}
                        >
                            {ref.label}
                        </a>
                    </span>
                ))}
            </p>
        );
    }

    return (
        <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                参考来源
            </p>
            <ul className="space-y-3">
                {ND_CALCULATOR_REFERENCES.map((ref) => (
                    <li key={ref.href} className="flex gap-2.5">
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                            <a
                                href={ref.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-sm font-medium text-foreground ${linkClassName}`}
                            >
                                {ref.label}
                            </a>
                            <span className="ml-1.5 text-[10px] text-muted-foreground">
                                {ref.source}
                            </span>
                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                                {ref.description}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
