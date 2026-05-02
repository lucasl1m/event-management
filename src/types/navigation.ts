import { Calendar, Home } from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/', icon: Home, labelKey: 'home' },
  { href: '/events', icon: Calendar, labelKey: 'events' },
] as const;
