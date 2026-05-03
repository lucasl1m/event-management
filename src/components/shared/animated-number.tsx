'use client';

import NumberFlow, { type Format } from '@number-flow/react';
import { useState, useEffect } from 'react';

type AnimatedNumberProps = {
  value: number;
  format?: Format;
  locales?: string;
  className?: string;
};

export function AnimatedNumber({
  value,
  format,
  locales = 'pt-BR',
  className,
}: AnimatedNumberProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setDisplayed(value));
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <NumberFlow
      suppressHydrationWarning
      value={displayed}
      format={format}
      locales={locales}
      className={className}
    />
  );
}
