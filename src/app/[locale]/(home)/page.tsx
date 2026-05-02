import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HomePageClient } from '@/components/home/home-page-client';
import { HomeSkeleton } from '@/components/home/home-skeleton';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Overview of events, check-ins and status in real time.',
};

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomePageClient />
    </Suspense>
  );
}
