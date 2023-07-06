// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function truncateTables() {
  try {
    // Get all table names
    /** @type {{ table_name: string }[]} */
    const tableNames = await prisma.$queryRaw`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' -- Replace 'public' with your schema name if necessary
    AND table_type = 'BASE TABLE'
    `;

    // Truncate each table
    for (const { table_name } of tableNames) {
      await prisma.$queryRaw`TRUNCATE TABLE "${table_name}" RESTART IDENTITY CASCADE`;
    }

    console.log('All tables truncated successfully.');
  } catch (error) {
    console.error('Error truncating tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

truncateTables();
