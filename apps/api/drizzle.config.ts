// drizzle.config.ts
import type { Config } from 'drizzle-kit';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

console.log('DATABASE_URL', DATABASE_URL);

export default {
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
} satisfies Config;
