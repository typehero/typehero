import * as schema from '../schema';
import {connection  } from '../connection';
import { drizzle } from 'drizzle-orm/mysql2';

export const db = drizzle(
  connection, 
  {
    schema
  }
);
