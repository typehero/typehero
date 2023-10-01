import { createObjectCsvWriter } from 'csv-writer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from '../src';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../.tmp/dump.csv');

const csvWriter = createObjectCsvWriter({
  path: csvPath,
  header: [
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
  ],
});

const waitlist = await prisma.waitlist.findMany({
  select: {
    name: true,
    email: true,
  },
});

await csvWriter.writeRecords(waitlist);
