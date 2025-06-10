import React from 'react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Home, PlusSquare, Briefcase } from 'lucide-react';
import PublicLogo from './public-logo';
import PublicLogoIcon from './public-logo-icon';
import { Icon } from '@/components/icon';

export function PublicSidebar() {
    const { auth } = usePage().props as any;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
            icon: LayoutGrid,
            isActive: route().current('dashboard'),
        },
        {
            title: 'Properties',
            href: route('properties.index'),
            icon: Home,
            isActive: route().current('properties.index') || route().current('properties.show'),
        },
        {
            title: 'Buying',
            href: '/dashboard',
            icon: Briefcase,
        },
        {
            title: 'Renting',
            href: '/properties',
            icon: Folder,
        },
        {
            title: 'Selling',
            href: '/properties/create',
            icon: PlusSquare,
        },
        {
            title: 'All Properties',
            href: '/properties',
            icon: BookOpen,
        },
    ];

    if (auth.user) {
        mainNavItems.push(
            {
                title: 'Locations',
                href: '/locations',
                icon: PlusSquare,
            }
        );
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    const user = usePage<SharedData>().props.auth?.user;

    return (

        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <PublicLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {user && <NavUser />}
            </SidebarFooter>
        </Sidebar>

    );
}