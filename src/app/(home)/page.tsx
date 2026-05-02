import { Suspense } from 'react';
import { HomePageClient } from '@/components/home/home-page-client';
import { HomeSkeleton } from '@/components/home/home-skeleton';

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomePageClient />
    </Suspense>
  );
}
