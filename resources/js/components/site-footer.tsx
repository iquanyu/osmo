import { Link, usePage } from '@inertiajs/react';
import { Camera, PenLine } from 'lucide-react';
import {
    assistant as assistantRoute,
    community as communityRoute,
    dashboard as dashboardRoute,
    login as loginRoute,
} from '@/routes';
import { index as adminRoute } from '@/routes/admin';
import { index as contributeRoute } from '@/routes/contribute';
import { index as toolsRoute } from '@/routes/tools';
import { index as tutorialsRoute } from '@/routes/tutorials';

interface FooterLink {
    label: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

export function SiteFooter() {
    const { auth } = usePage().props as {
        auth: {
            user: {
                name: string;
                role?: 'admin' | 'player';
            } | null;
        };
    };

    const contentLinks: FooterLink[] = [
        { label: '教程', href: tutorialsRoute.url() },
        { label: '工具箱', href: toolsRoute.url() },
        { label: '智能场景 AI', href: assistantRoute.url() },
        { label: '社区', href: communityRoute.url() },
    ];

    const workspaceLinks: FooterLink[] = auth.user
        ? auth.user.role === 'admin'
            ? [
                  { label: '管理后台', href: adminRoute.url() },
                  { label: '教程库', href: tutorialsRoute.url() },
              ]
            : [
                  { label: '我的投稿', href: contributeRoute.url() },
                  { label: '个人仪表盘', href: dashboardRoute.url() },
              ]
        : [{ label: '登录 / 注册', href: loginRoute.url() }];

    const sections: FooterSection[] = [
        { title: '内容前台', links: contentLinks },
        { title: '创作者', links: workspaceLinks },
    ];

    return (
        <footer className="mt-auto border-t border-border bg-muted/20">
            <div className="h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
                    <div className="md:col-span-5 lg:col-span-4">
                        <Link
                            href={tutorialsRoute.url()}
                            className="inline-flex items-center gap-2.5"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white">
                                <Camera className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-sm font-bold tracking-tight">
                                    DJI Pocket 3
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    视频拍摄大师实操网
                                </span>
                            </div>
                        </Link>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            面向中文自媒体创作者的 Pocket 3
                            实操社区：教程、参数模拟、场景 AI
                            与飞友交流，一站搞懂电影感拍摄。
                        </p>
                        {auth.user && auth.user.role !== 'admin' && (
                            <Link
                                href={contributeRoute.url()}
                                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 transition-colors hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                            >
                                <PenLine className="h-4 w-4" />
                                分享你的拍摄经验
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 lg:col-span-8">
                        {sections.map((section) => (
                            <div key={section.title}>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                                    {section.title}
                                </h3>
                                <ul className="mt-3 space-y-2.5">
                                    {section.links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        <div className="col-span-2 sm:col-span-1">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                                说明
                            </h3>
                            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                                本站为玩家经验共建社区，教程与参数建议仅供参考，请以
                                DJI 官方文档与固件说明为准。
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-center sm:flex-row sm:text-left">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} DJI Osmo Pocket 3
                        视频拍摄大师实操网 · 专为中文自媒体创作者打造
                    </p>
                    <p className="text-[11px] text-muted-foreground/80">
                        非 DJI 官方网站
                    </p>
                </div>
            </div>
        </footer>
    );
}
