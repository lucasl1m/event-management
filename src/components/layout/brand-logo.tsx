'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority }: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useIsClient();
  const isLight = mounted && resolvedTheme === 'light';
  const src = isLight ? '/logo-light.svg' : '/logo.svg';

  return (
    <Image
      src={src}
      alt="Lifters"
      width={120}
      height={31}
      className={cn('h-7 w-auto', className)}
      priority={priority}
    />
  );
}
