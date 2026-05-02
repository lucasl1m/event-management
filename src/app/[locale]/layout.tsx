import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { routing } from '@/i18n/routing';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <div className="flex h-full min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />

          <main id="main-content" className="flex-1 overflow-y-auto pb-16 md:pb-0">
            {children}
          </main>
        </div>

        <MobileNav />
      </div>
    </NextIntlClientProvider>
  );
}
