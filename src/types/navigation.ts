import { CalendarRangeIcon, HomeIcon } from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/', icon: HomeIcon, label: 'Início' },
  { href: '/events', icon: CalendarRangeIcon, label: 'Eventos' },
] as const;
