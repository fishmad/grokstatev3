import PublicLogoIcon from './public-logo-icon';

export default function PublicLogo() {
    return (
        <>
            <div className="m-0 p-0 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <PublicLogoIcon />
            </div>
            <div className="m-0 p-0 text-left text-xl font-semibold dark:text-white tracking-tight">
                <span className="text-orange-600 dark:text-white">RealtySite</span>
            </div>



        </>
    );
}

{/* 
            <div className="w-full h-16 bg-white/90 dark:bg-neutral-950/90 border-b border-neutral-200 dark:border-neutral-800 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="flex items-center gap-3 px-4 py-4">
                    <PublicLogoIcon />
                    <span className="font-bold text-lg text-orange-600 dark:text-white whitespace-nowrap">RealtySite</span>
                </div>
            </div>
 */}