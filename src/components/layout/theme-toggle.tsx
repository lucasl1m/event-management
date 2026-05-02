'use client';

import { useSyncExternalStore } from 'react';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const t = useTranslations('layout.theme');
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsClient();

  const current = theme ?? 'dark';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground hover:text-primary"
          aria-label={mounted ? t('open') : t('open')}
        >
          {!mounted ? (
            <MoonIcon className="size-4" aria-hidden />
          ) : resolvedTheme === 'dark' ? (
            <MoonIcon className="size-4" aria-hidden />
          ) : (
            <SunIcon className="size-4" aria-hidden />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          {t('appearance')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={current} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light" className="gap-2">
            <SunIcon className="size-4" aria-hidden />
            {t('light')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="gap-2">
            <MoonIcon className="size-4" aria-hidden />
            {t('dark')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="gap-2">
            <MonitorIcon className="size-4" aria-hidden />
            {t('system')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
