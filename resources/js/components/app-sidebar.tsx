import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Gauge,
    LayoutDashboard,
    MessagesSquare,
    PenLine,
    ScrollText,
    ShieldCheck,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    community as communityRoute,
    dashboard as dashboardRoute,
} from '@/routes';
import {
    community as adminCommunityRoute,
    index as adminIndexRoute,
    submissions as adminSubmissionsRoute,
    tutorials as adminTutorialsRoute,
} from '@/routes/admin';
import { index as contributeRoute } from '@/routes/contribute';
import { index as tutorialsRoute } from '@/routes/tutorials';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const hasAdminRole = page.props.auth.user?.role === 'admin';
    const currentPath = new URL(page.url, 'http://localhost').pathname;

    const workspaceItems: NavItem[] = hasAdminRole
        ? [
              {
                  title: '运营总览',
                  href: adminIndexRoute.url(),
                  icon: LayoutDashboard,
                  isActive: currentPath === adminIndexRoute.url(),
              },
              {
                  title: '投稿审核',
                  href: adminSubmissionsRoute.url(),
                  icon: ShieldCheck,
                  isActive: currentPath.startsWith(adminSubmissionsRoute.url()),
              },
              {
                  title: '教程管理',
                  href: adminTutorialsRoute.url(),
                  icon: BookOpen,
                  isActive: currentPath.startsWith(adminTutorialsRoute.url()),
              },
              {
                  title: '用户管理',
                  href: '/admin/users',
                  icon: Users,
                  isActive: currentPath.startsWith('/admin/users'),
              },
              {
                  title: '日志管理',
                  href: '/admin/logs',
                  icon: ScrollText,
                  isActive: currentPath.startsWith('/admin/logs'),
              },
              {
                  title: '社区管理',
                  href: adminCommunityRoute.url(),
                  icon: MessagesSquare,
                  isActive: currentPath.startsWith(adminCommunityRoute.url()),
              },
          ]
        : [
              {
                  title: '个人仪表盘',
                  href: dashboardRoute.url(),
                  icon: Gauge,
                  isActive: currentPath === dashboardRoute.url(),
              },
              {
                  title: '我的投稿',
                  href: contributeRoute.url(),
                  icon: PenLine,
                  isActive: currentPath.startsWith(contributeRoute.url()),
              },
          ];

    const contentItems: NavItem[] = [
        {
            title: '教程库',
            href: tutorialsRoute.url(),
            icon: BookOpen,
        },
        {
            title: '玩家社区',
            href: communityRoute.url(),
            icon: MessagesSquare,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={
                                    hasAdminRole
                                        ? adminIndexRoute.url()
                                        : contributeRoute.url()
                                }
                                prefetch
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain
                    items={workspaceItems}
                    label={hasAdminRole ? '运营工作台' : '创作工作台'}
                />
                <NavMain items={contentItems} label="内容前台" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
