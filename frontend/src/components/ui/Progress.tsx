import React from 'react';
import { cn } from '@/utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  default: 'bg-brand-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    value, 
    max = 100, 
    size = 'md', 
    variant = 'default',
    showLabel = false,
    label,
    className,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className="w-full">
        {(showLabel || label) && (
          <div className="flex justify-between items-center mb-1.5">
            {label && (
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {label}
              </span>
            )}
            {showLabel && (
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        
        <div
          ref={ref}
          className={cn(
            'w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700',
            sizeClasses[size],
            className
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          {...props}
        >
          <div
            className={cn(
              'h-full transition-all duration-300 ease-out rounded-full',
              variantClasses[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export default Progress;
