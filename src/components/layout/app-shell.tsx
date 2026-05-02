import type { ReactNode } from 'react';
import { MobileNav } from './mobile-nav';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
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
  );
}
