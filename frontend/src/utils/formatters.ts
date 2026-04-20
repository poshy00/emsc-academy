import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format price with currency symbol
 */
export const formatPrice = (
  amount: number,
  currency: string = 'EUR',
  locale: string = 'es-ES'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format duration in hours to readable string
 */
export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }
  if (hours < 10) {
    return `${hours.toFixed(1)} h`;
  }
  return `${Math.round(hours)} h`;
};

/**
 * Format minutes to HH:MM
 */
export const formatMinutes = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins}min`;
  }
  return `${mins} min`;
};

/**
 * Format seconds to MM:SS
 */
export const formatSeconds = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format date to locale string
 */
export const formatDate = (
  dateString: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return format(date, defaultOptions, { locale: es });
};

/**
 * Format date relative to now (e.g., "hace 2 horas")
 */
export const formatRelativeTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '';

  return formatDistanceToNow(date, { 
    addSuffix: true, 
    locale: es 
  });
};

/**
 * Generate slug from title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)/g, ''); // Trim hyphens
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (
  completed: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 *capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generate random placeholder avatar URL
 */
export const getAvatarUrl = (name: string, size: number = 40): string => {
  const encoded = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encoded}&size=${size}&background=random&color=fff&bold=true`;
};

/**
 * Parse JWT token to get payload (without verification - for client-side only)
 */
export const parseJWT = (token: string): { [key: string]: unknown } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
