export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  database: string;
  isConfigured: boolean;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  const dbUrl = process.env.DATABASE_URL || '';
  
  if (!dbUrl) {
    return {
      url: '',
      host: 'unknown',
      port: 5432,
      database: 'unknown',
      isConfigured: false
    };
  }

  try {
    const parsedUrl = new URL(dbUrl);
    return {
      url: dbUrl,
      host: parsedUrl.hostname || 'localhost',
      port: parseInt(parsedUrl.port || '5432', 10),
      database: parsedUrl.pathname.replace('/', '') || 'ecommerce_db',
      isConfigured: true
    };
  } catch {
    return {
      url: dbUrl,
      host: 'invalid-url',
      port: 5432,
      database: 'invalid-db',
      isConfigured: false
    };
  }
};
