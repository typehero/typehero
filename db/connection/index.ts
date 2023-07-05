import mysql from 'mysql2/promise';
// @ts-ignore
export const connection = await mysql.createConnection(process.env.DATABASE_URL);