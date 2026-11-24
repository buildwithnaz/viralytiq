import * as React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('glass-surface rounded-xl text-slate-100 p-5', className)}
    {...props}
  />
));
Card.displayName = 'Card';
