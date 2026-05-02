'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDaysIcon,
  CalendarRangeIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', icon: LayoutDashboardIcon, label: 'Dashboard' },
  { href: '/events', icon: CalendarRangeIcon, label: 'Events' },
  { href: '/calendar', icon: CalendarDaysIcon, label: 'Calendar' },
  { href: '/settings', icon: SettingsIcon, label: 'Settings' },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Navegação principal"
      className="hidden w-[240px] shrink-0 flex-col border-r border-border/50 bg-background md:flex"
    >
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-5">
        <span
          aria-hidden
          className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25"
        >
          <CalendarRangeIcon className="size-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight text-foreground">Eventos</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-emerald-500/8 text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-y-1.5 left-0 w-0.5 rounded-r-full bg-emerald-400"
                />
              )}
              <Icon
                aria-hidden
                className={cn(
                  'size-4 shrink-0 transition-transform duration-150',
                  isActive
                    ? 'text-emerald-400'
                    : 'text-muted-foreground/70 group-hover:translate-x-px group-hover:text-foreground',
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
