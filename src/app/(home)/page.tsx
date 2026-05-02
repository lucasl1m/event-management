import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HomePageClient } from '@/components/home/home-page-client';
import { HomeSkeleton } from '@/components/home/home-skeleton';

export const metadata: Metadata = {
  title: 'Início — Painel de Gestão de Eventos',
  description: 'Visão geral dos eventos: métricas, check-ins e status em tempo real.',
};

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomePageClient />
    </Suspense>
  );
}
