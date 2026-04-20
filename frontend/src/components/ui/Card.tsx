import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'bottom-border';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md', 
    hoverable = false, 
    children, 
    ...props 
  }, ref) => {
    const baseStyles = 'bg-white dark:bg-neutral-800 rounded-xl overflow-hidden';
    
    const variants = {
      default: 'border border-neutral-200 dark:border-neutral-700',
      elevated: 'border border-neutral-200 dark:border-neutral-700 shadow-card hover:shadow-card-hover transition-shadow',
      outlined: 'border-2 border-neutral-300 dark:border-neutral-600',
      'bottom-border': 'border-b border-neutral-200 dark:border-neutral-700 rounded-none',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          hoverable && 'transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Compound components
Card.Header = function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props}>{children}</div>;
};

Card.Title = function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-bold text-neutral-900 dark:text-white', className)} {...props}>
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-neutral-600 dark:text-neutral-400 mt-1', className)} {...props}>
      {children}
    </p>
  );
};

Card.Content = function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700', className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
