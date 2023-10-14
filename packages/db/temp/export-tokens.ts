// @ts-nocheck
// this file is temporary
import { createObjectCsvWriter } from 'csv-writer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from '.';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../.tmp/dump.csv');

const csvWriter = createObjectCsvWriter({
  path: csvPath,
  header: [{ id: 'token', title: 'token' }],
});

const tokens = await prisma.betaTokens.findMany({
  select: {
    token: true,
  },
});

await csvWriter.writeRecords(tokens);
