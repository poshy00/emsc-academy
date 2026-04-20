import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-2.5 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
        primary: "bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-200",
        secondary: "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300",
        success: "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-200",
        warning: "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-200",
        error: "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-200",
        accent: "bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-200",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
