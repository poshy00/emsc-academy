import morgan from 'morgan';
import { format } from 'date-fns';

// Custom token for timestamp
morgan.token('timestamp', (req) => format(new Date(), 'yyyy-MM-dd HH:mm:ss'));

/**
 * Request logging middleware
 * Only logs in development by default
 */
export const logger = morgan(
  ':timestamp :method :url :status :response-time ms - :res[content-length]',
  {
    skip: (req, res) => process.env.NODE_ENV === 'production' && res.statusCode < 400,
  }
);
