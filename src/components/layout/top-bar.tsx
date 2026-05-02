import { BellIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TopBar() {
  return (
    <header
      aria-label="Barra de topo"
      className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur md:px-6"
    >
      <div className="flex md:hidden">
        <span className="text-sm font-semibold tracking-tight text-foreground">Eventos</span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notificações"
          className="size-9 text-muted-foreground hover:text-foreground"
        >
          <BellIcon className="size-4" />
        </Button>

        <Avatar className="size-8 cursor-pointer ring-1 ring-border/60 ring-offset-1 ring-offset-background transition-opacity hover:opacity-80">
          <AvatarFallback className="bg-emerald-500/15 text-xs font-semibold text-emerald-300">
            JD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
