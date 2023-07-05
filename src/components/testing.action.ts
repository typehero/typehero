import { db } from '../../db/client';
export async function testing() {
  const data = await db.query.Account.findMany()
  console.info(data);
  return data;
}