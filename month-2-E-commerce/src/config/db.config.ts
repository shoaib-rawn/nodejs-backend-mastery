import pg from 'pg';

// 1. Create a PostgreSQL connection pool using DATABASE_URL from .env
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

// 2. Simple helper function to test if PostgreSQL is connected
export const checkDbConnection = async () => {
  try {
    // Send a simple SQL query to get current time from database
    const result = await pool.query('SELECT NOW()');
    return {
      isConnected: true,
      time: result.rows[0].now
    };
  } catch (error: unknown) {
    // Return connection error message if failed
    const message = error instanceof Error ? error.message : 'Connection failed';
    return {
      isConnected: false,
      error: message
    };
  }
};
