'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/types/navigation';

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação mobile"
      className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center border-t border-border/60 bg-background/95 backdrop-blur md:hidden"
    >
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium uppercase tracking-widest transition-colors duration-150',
              isActive
                ? 'text-emerald-400'
                : 'text-muted-foreground/60 hover:text-muted-foreground',
            )}
          >
            <Icon
              aria-hidden
              className={cn(
                'size-5 transition-transform duration-150',
                isActive ? 'scale-110' : '',
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
