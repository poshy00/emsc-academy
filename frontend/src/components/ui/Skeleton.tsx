import React from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

const variantClasses = {
  text: 'rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-lg',
};

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className, 
    variant = 'text', 
    width, 
    height, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-neutral-200 dark:bg-neutral-700',
          variantClasses[variant],
          className
        )}
        style={{
          width: width || (variant === 'circular' ? '100%' : 'auto'),
          height: height || (variant === 'text' ? '1em' : 'auto'),
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Common skeleton patterns
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn('bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden', className)}>
    <Skeleton variant="rectangular" height={200} className="w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" className="h-5 w-3/4" />
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-5/6" />
      <div className="pt-2 flex justify-between items-center">
        <Skeleton variant="text" className="h-6 w-20" />
        <Skeleton variant="rectangular" className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        variant="text" 
        className={cn('h-4', i === lines - 1 && 'w-2/3')} 
      />
    ))}
  </div>
);

export const SkeletonButton = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  };
  return <Skeleton variant="rectangular" className={sizeClasses[size]} />;
};

export default Skeleton;
