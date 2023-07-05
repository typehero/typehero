import type { Config } from 'drizzle-kit';
 
export default {
  schema: './db/schema/index.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: 'mysql://dev:dev@localhost/typehero',
  }
} satisfies Config;