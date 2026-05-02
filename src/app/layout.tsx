import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { MobileNav } from '@/components/layout/mobile-nav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Painel de Gestão de Eventos',
  description: 'Painel para acompanhamento de eventos, controle de acesso e métricas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground h-full">
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}
