import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { type Property } from '@/types/property-types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Menu, Search, Home, PlusSquare, Briefcase, User, ChevronDown, LogOut, Heart, } from 'lucide-react';
import PublicLogo from './public-logo';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { PublicSidebar } from './public-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { HeroSearchBar } from './hero-search-bar';
import { useState } from 'react';
import { AdvancedSearchSheet } from './advanced-search-sheet';
import type { LucideIcon } from 'lucide-react';


const mainNavItems: NavItem[] = [

    {
        title: 'Properties',
        href: '/properties',
        icon: Home as LucideIcon,
    },
    {
        title: 'Sell (Create)',
        href: '/properties/create',
        icon: Home as LucideIcon,
    },
    // {
    //     title: '[Admin]',
    //     href: '/admin',
    //     icon: PlusSquare as LucideIcon,
    // },
];

const rightNavItems: NavItem[] = [
    // {
    //     title: 'About',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder as LucideIcon,
    // },
    {
        title: 'Support',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen as LucideIcon,
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const [isAdvancedSearchOpen, setAdvancedSearchOpen] = useState(false);

    // Determine if we're on the welcome page
    const isWelcomePage = page.url === '/' || page.url === '/welcome';

    return (
        <>
            <header className="
                sticky 
                top-0 
                z-30 
                bg-white/90 
                dark:bg-neutral-950/90 
                border-b 
            ">
                {/* <div className="
                sticky 
                top-0 
                z-30 
                bg-white/90 
                dark:bg-neutral-950/90 
                border-b 
                "> */}
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">

                    {/* Mobile Menu & Logo */}
                    {/* <div className="lg:hidden flex items-center gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]" aria-label="Open menu">
                                    <Menu className="[&_svg]:size-20 mr-0 h-10 w-10" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-sidebar flex h-full w-64 flex-col items-stretch justify-between">

                                <SidebarProvider>
                                    <PublicSidebar />
                                </SidebarProvider>
                            </SheetContent>
                        </Sheet>
                    </div> */}

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-5 h-[34px] w-[34px]" aria-label="Open menu">
                                <Menu className="[&_svg]:size-16 mr-0 h-7 w-7" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-sidebar flex h-full w-64 flex-col items-stretch justify-between">
                            <SidebarProvider>
                                <PublicSidebar />
                            </SidebarProvider>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" prefetch className="flex items-center space-x-2 gap-2 text-orange-600">
                        <PublicLogo />
                        <span className="sr-only">Home</span>
                    </Link>


                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">

                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">

                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === item.href && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && typeof item.icon === 'function' && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url === item.href && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                                
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">

                        <div className="relative flex items-center space-x-1">

                            {/* Hide search icon on welcome page (mobile only) */}
                            {/* {!isWelcomePage && (
                                <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer" onClick={() => setAdvancedSearchOpen(true)}>
                                        <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>Advanced Search</p>
                                    </TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                            )} */}

                            <div className="hidden lg:flex">

                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer" onClick={() => setAdvancedSearchOpen(true)}>
                                            <Search className="size-5 opacity-80 group-hover:opacity-100" />
                                        </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                        <p>Advanced Search</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            
                                {rightNavItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                      <Tooltip key={item.title}>
                                        <TooltipTrigger asChild>
                                          <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group text-accent-foreground ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                          >
                                            <span className="sr-only">{item.title}</span>
                                            {IconComponent && (
                                              <IconComponent className="size-5 opacity-80 group-hover:opacity-100" />
                                            )}
                                          </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{item.title}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    );
                                })}

                                <AppearanceToggleDropdown />

                                {auth.user ? (
                                    <DropdownMenu>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="group w-15 h-9 cursor-pointer">
                                                        <User className="size-5 opacity-80 group-hover:opacity-100" />
                                                        <ChevronDown className="size-5 opacity-80 group-hover:opacity-100 ml-0" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>My Profile</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <DropdownMenuContent className="w-56" align="end">
                                            {auth.user && <UserMenuContent user={auth.user} />}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                <>
                                    <NavigationMenu className="flex h-full items-stretch">
                                        <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                            <NavigationMenuItem  className="relative flex h-full items-center">
                                                <Link href={route('login')} className="group px-3 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900">Log in</Link>
                                            </NavigationMenuItem>
                                            <NavigationMenuItem  className="relative flex h-full items-center">
                                                <Link href={route('register')} className="group px-3 py-1 rounded border border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950">Register</Link>
                                            </NavigationMenuItem>
                                        </NavigationMenuList>
                                    </NavigationMenu>
                                </>
                                )} 

                            </div>

                        </div>

                    </div>

                </div>
            {/* </div> */}
        </header>

            {/* {breadcrumbs.length > 0 && (
              <div className="border-sidebar-border/70 flex w-full border-b bg-transparent">
                <div className="mx-auto flex h-8 w-full items-center justify-start px-4 text-neutral-400 md:max-w-7xl text-xs">
                  <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
              </div>
            )} */}

            {/* HERO SEARCH BAR */}
            {isWelcomePage && (
            <div className="w-full h-full">
                <section className="grow bg-gradient-to-b from-orange-50 to-white dark:from-neutral-900 dark:to-neutral-950">
                    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 pt-12 pb-12">
                        <h1 className="w-full text-center text-2xl md:text-4xl font-bold text-neutral-900 dark:text-white whitespace-normal">
                            Find Your Dream Home in Australia
                        </h1>
                        <div className="w-full max-w-xl">
                            <HeroSearchBar />
                        </div>
                    </div>
                </section>
            </div>
            )}

            {/* Advanced Search Sheet (rendered outside header for accessibility) */}
            <AdvancedSearchSheet
                open={isAdvancedSearchOpen}
                onOpenChange={setAdvancedSearchOpen}
            />
        </>
    );
}