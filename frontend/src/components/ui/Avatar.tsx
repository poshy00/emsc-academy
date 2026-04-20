import React from 'react';
import { cn } from '@/utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  statusColor?: 'green' | 'yellow' | 'red' | 'gray';
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusColors = {
  green: 'bg-success-500',
  yellow: 'bg-warning-500',
  red: 'bg-error-500',
  gray: 'bg-neutral-400',
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    src, 
    alt = '', 
    name = '', 
    size = 'md', 
    showStatus = false, 
    statusColor = 'green',
    className, 
    ...props 
  }, ref) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

    const getContrastColor = (name: string): string => {
      const colors = [
        'bg-brand-100 text-brand-800',
        'bg-success-100 text-success-800',
        'bg-warning-100 text-warning-800',
        'bg-accent-100 text-accent-800',
        'bg-neutral-200 text-neutral-800',
      ];
      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    };

    return (
      <div 
        ref={ref} 
        className={cn('relative shrink-0 rounded-full flex items-center justify-center', sizeClasses[size], className)} 
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className={cn('font-medium', getContrastColor(name))}>
            {initials}
          </span>
        )}

        {showStatus && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full border-2 border-white dark:border-neutral-800',
              statusColors[statusColor]
            )}
            style={{
              width: size === 'xs' ? '8px' : size === 'sm' ? '10px' : '12px',
              height: size === 'xs' ? '8px' : size === 'sm' ? '10px' : '12px',
            }}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
