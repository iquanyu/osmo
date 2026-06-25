import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { index as toolsRoute } from '@/routes/tools';

interface Props {
    title: string;
    description: string;
    badge?: string;
    children: ReactNode;
}

export function ToolsPageShell({
    title,
    description,
    badge,
    children,
}: Props) {
    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <Link
                href={toolsRoute.url()}
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                返回工具箱
            </Link>

            <div className="mb-8 max-w-2xl">
                {badge && (
                    <span className="mb-2 inline-block font-mono text-[10px] font-bold uppercase tracking-widest text-red-500">
                        {badge}
                    </span>
                )}
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>

            {children}
        </div>
    );
}
