'use client';

import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/layout/brand-logo';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/types/navigation';

export function Sidebar() {
  const t = useTranslations('layout.navigation');
  const pathname = usePathname();

  return (
    <aside
      aria-label={t('main')}
      className="hidden w-[240px] shrink-0 flex-col border-r border-border/50 bg-background md:flex"
    >
      <div className="flex h-16 items-center border-b border-border/50 px-5">
        <BrandLogo priority />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary/10 text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-y-1.5 left-0 w-0.5 rounded-r-full bg-primary"
                />
              )}
              <Icon
                aria-hidden
                className={cn(
                  'size-4 shrink-0 transition-transform duration-150',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground/70 group-hover:translate-x-px group-hover:text-foreground',
                )}
              />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
