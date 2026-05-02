'use client';

import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createQueryClient } from '@/lib/query-client';
import { useInitMobile, useUiStore } from '@/stores/ui-store';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());
  useInitMobile();
  const isMobile = useUiStore((s) => s.isMobile);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      storageKey="event-mgmt-theme"
    >
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <TooltipProvider>
            {children}
            <Toaster position={isMobile ? 'top-center' : 'top-right'} richColors closeButton />
          </TooltipProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
