import { Link, usePage } from '@inertiajs/react';
import { Camera, Moon, Sun, User, Shield, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { MainLayoutSearch } from '@/components/main-layout-search';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { useCurrentUrl } from '@/hooks/use-current-url';
import {
    assistant as assistantRoute,
    community as communityRoute,
} from '@/routes';
import { index as adminRoute } from '@/routes/admin';
import { index as toolsRoute } from '@/routes/tools';
import { index as tutorialsRoute } from '@/routes/tutorials';

interface NavItem {
    label: string;
    href: string;
    active: boolean;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as { auth: { user: { id: number; name: string; email: string; role?: 'admin' | 'player' } | null } };
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems: NavItem[] = [
        { label: '教程', href: tutorialsRoute.url(), active: isCurrentOrParentUrl(tutorialsRoute.url()) },
        { label: '工具箱', href: toolsRoute.url(), active: isCurrentOrParentUrl(toolsRoute.url()) },
        { label: '社区', href: communityRoute.url(), active: isCurrentOrParentUrl(communityRoute.url()) },
        { label: '智能场景AI', href: assistantRoute.url(), active: isCurrentOrParentUrl(assistantRoute.url()) },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* DJI 红色品牌条 */}
            <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center gap-3">
                        {/* Logo */}
                        <Link href={tutorialsRoute.url()} className="flex shrink-0 items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
                                <Camera className="h-5 w-5" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold tracking-tight">DJI Pocket 3</span>
                                <span className="ml-2 text-xs text-muted-foreground">视频拍摄大师实操网</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        item.active
                                            ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <MainLayoutSearch className="hidden md:flex max-w-md flex-1 justify-end" />

                        {/* Right Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                            {/* Theme Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                                title="切换主题"
                            >
                                {resolvedAppearance === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>

                            {/* Admin Entry */}
                            {auth.user?.role === 'admin' && (
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={adminRoute.url()}>
                                        <Shield className="mr-1 h-4 w-4" />
                                        <span className="hidden sm:inline">管理后台</span>
                                    </Link>
                                </Button>
                            )}

                            {/* User Menu */}
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <div className="px-2 py-1.5">
                                            <p className="text-sm font-medium">{auth.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings/profile">
                                                <Settings className="mr-2 h-4 w-4" />
                                                账户设置
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/logout" method="post" as="button" className="w-full cursor-pointer">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                退出登录
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">登录</Link>
                                </Button>
                            )}

                            {/* Mobile menu button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile search */}
                    <div className="pb-3 md:hidden">
                        <MainLayoutSearch />
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <nav className="lg:hidden border-t border-border py-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-sm font-medium ${
                                        item.active
                                            ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            <SiteFooter />
        </div>
    );
}
