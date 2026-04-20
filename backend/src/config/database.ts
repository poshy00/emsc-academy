import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const query = async <T = any>(text: string, params?: any[]): Promise<{ data: T[] | null; error: Error | null }> => {
  try {
    const result = await pool.query(text, params);
    return { data: result.rows as T[], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};
