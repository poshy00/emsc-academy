import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

// Button component with multiple variants
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm hover:shadow",
        secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
        outline: "border-2 border-brand-500 text-brand-600 hover:bg-brand-50 active:bg-brand-100 dark:border-brand-400 dark:text-brand-400",
        ghost: "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800",
        danger: "bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-sm",
        success: "bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-sm",
        accent: "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm",
      },
      size: {
        sm: "px-3 py-1.5 text-sm rounded-lg",
        md: "px-4 py-2 text-sm rounded-lg",
        lg: "px-6 py-3 text-base rounded-xl",
        xl: "px-8 py-4 text-lg rounded-xl",
        icon: "p-2 rounded-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  isLoading?: boolean; // Alias for loading
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    leftIcon, 
    rightIcon, 
    loading, 
    isLoading,
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const isLoadingState = loading || isLoading;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoadingState}
        {...props}
      >
        {isLoadingState && (
          <svg 
            className="animate-spin h-4 w-4 mr-2" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" 
            />
          </svg>
        )}
        {!isLoadingState && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoadingState && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
