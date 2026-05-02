import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BrandLogo } from '@/components/layout/brand-logo';
import { LocaleToggle } from '@/components/layout/locale-toggle';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export function TopBar() {
  const t = useTranslations('layout.topBar');

  return (
    <header
      aria-label={t('title')}
      className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur md:px-6"
    >
      <div className="flex md:hidden">
        <BrandLogo priority />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <LocaleToggle />
        <ThemeToggle />

        <Avatar className="size-8 cursor-pointer ring-1 ring-border/60 ring-offset-1 ring-offset-background transition-opacity hover:opacity-80">
          <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
            JD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
