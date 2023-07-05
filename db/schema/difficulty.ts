
import {
  mysqlEnum, mysqlTable,
  text
} from 'drizzle-orm/mysql-core';

export const Difficulty = mysqlEnum('Difficulty', ['EASY', 'BEGINNER', 'MEDIUM', 'HARD', 'EXPERT']);

export const Account = mysqlTable(
  'Account',
  {
    id: text('id').primaryKey(),
    userId: text('userId').notNull()
  }
);
