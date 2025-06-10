import { Home } from 'lucide-react';
import type { SVGAttributes } from 'react';

export default function PublicLogoIcon({ className = '', ...props }: SVGAttributes<SVGElement>) {
    return (
        <Home 
            className={`h-7 w-6 size-7 text-orange-600 dark:text-orange-600 flex-shrink-0 ${className}`} 
            strokeWidth={2} 
            fill="none" 
            {...props}
            style={{ minWidth: 28, minHeight: 28, maxWidth: 28, maxHeight: 28 }}
        />
    );
}