import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070E] disabled:pointer-events-none disabled:opacity-45 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-indigo-500 via-indigo-500 to-violet-500 text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.65)] hover:brightness-110 border border-indigo-400/30',
        glass:
          'bg-white/[0.05] text-slate-100 border border-white/[0.1] backdrop-blur-md hover:bg-white/[0.09] hover:border-white/[0.18]',
        outline:
          'border border-white/[0.12] bg-transparent text-slate-200 hover:bg-white/[0.05] hover:text-white',
        ghost:
          'text-slate-300 hover:bg-white/[0.06] hover:text-white',
        destructive:
          'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-5 text-sm',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
