import { AlertCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const t = useTranslations('common');

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircleIcon className="h-8 w-8 text-destructive" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title ?? t('errorTitle')}</h3>
        <p className="text-sm text-muted-foreground">{description ?? t('errorDescription')}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          {t('retry')}
        </Button>
      )}
    </div>
  );
}
