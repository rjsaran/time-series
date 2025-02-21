export interface Configuration {
  server: {
    port: number;
  };
  auth: {
    jwt: {
      secret: string;
      expires_in: number;
    };
  };
  database: {
    postgres: {
      host: string;
      port: number;
      db: string;
      username: string;
      password: string;
    };
  };
}

export const configuration = (): Configuration => {
  return {
    server: {
      port: parseInt(process.env.PORT || '3000', 10),
    },
    auth: {
      jwt: {
        secret: process.env.JWT_SECRET || '',
        expires_in: (Number(process.env.JWT_EXPIRY_IN_MINUTES) || 60) * 60, // Default: 1 Hours
      },
    },
    database: {
      postgres: {
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        host: process.env.POSTGRES_HOST || '127.0.0.1',
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || '',
        db: process.env.POSTGRES_DB || '',
      },
    },
  };
};
