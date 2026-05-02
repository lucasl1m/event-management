'use client';

import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createQueryClient } from '@/lib/query-client';
import { useInitMobile, useUiStore } from '@/stores/ui-store';

type ProvidersProps = {
  children: ReactNode;
};

function AppShell({ children }: ProvidersProps) {
  useInitMobile();
  const isMobile = useUiStore((s) => s.isMobile);

  return (
    <TooltipProvider>
      {children}
      <Toaster position={isMobile ? 'top-center' : 'top-right'} richColors closeButton />
    </TooltipProvider>
  );
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <AppShell>{children}</AppShell>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
