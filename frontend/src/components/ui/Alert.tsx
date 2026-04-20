import React from 'react';
import { AlertCircle, CheckCircle, Info, Warning, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const alertConfig = {
  info: {
    icon: Info,
    bgClass: 'bg-info-50 dark:bg-info-900/20',
    borderClass: 'border-info-200 dark:border-info-800',
    textClass: 'text-info-800 dark:text-info-200',
    iconClass: 'text-info-600 dark:text-info-400',
  },
  success: {
    icon: CheckCircle,
    bgClass: 'bg-success-50 dark:bg-success-900/20',
    borderClass: 'border-success-200 dark:border-success-800',
    textClass: 'text-success-800 dark:text-success-200',
    iconClass: 'text-success-600 dark:text-success-400',
  },
  warning: {
    icon: Warning,
    bgClass: 'bg-warning-50 dark:bg-warning-900/20',
    borderClass: 'border-warning-200 dark:border-warning-800',
    textClass: 'text-warning-800 dark:text-warning-200',
    iconClass: 'text-warning-600 dark:text-warning-400',
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-error-50 dark:bg-error-900/20',
    borderClass: 'border-error-200 dark:border-error-800',
    textClass: 'text-error-800 dark:text-error-200',
    iconClass: 'text-error-600 dark:text-error-400',
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}) => {
  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        'relative rounded-lg border p-4',
        config.bgClass,
        config.borderClass,
        config.textClass,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('shrink-0 mt-0.5', config.iconClass)}>
          <Icon size={20} />
        </div>
        
        <div className="flex-1">
          {title && (
            <h5 className="font-semibold mb-1">{title}</h5>
          )}
          <div className="text-sm opacity-90">
            {children}
          </div>
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              "shrink-0 ml-auto -mr-2 -mt-2 p-1 rounded-full",
              "hover:bg-black/5 dark:hover:bg-white/10 transition-colors",
              config.iconClass
            )}
            aria-label="Dismiss alert"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
