/* eslint-disable */
// @ts-nocheck
// https://github.com/algolia-samples/api-clients-quickstarts/blob/master/javascript/indexing.js

import { prisma } from '../src';

import algoliasearch from 'algoliasearch';

export const AOT_CHALLENGES = [
  'day-1',
  'day-2',
  'day-3',
  'day-4',
  'day-5',
  'day-6',
  'day-7',
  'day-8',
  'day-9',
  'day-10',
  'day-11',
  'day-12',
  'day-13',
  'day-14',
  'day-15',
  'day-16',
  'day-17',
  'day-18',
  'day-19',
  'day-20',
  'day-21',
  'day-22',
  'day-23',
  'day-24',
  'day-25',
];

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!,
);
const index = client.initIndex('typehero');

const challenges = await prisma.challenge.findMany({
  where: {
    slug: {
      notIn: AOT_CHALLENGES,
    },
  },
});

const objectsToSave = challenges.map((challenge) => ({ ...challenge, objectID: challenge.slug }));

let res = await index.search('');
console.log('Current objects: ', res.hits);

console.log('Save objects - Adding multiple objects: ', objectsToSave);
await index.saveObjects(objectsToSave).wait();

res = await index.search('');
console.log('Current objects: ', res.hits);

await index
  .setSettings({
    attributesForFaceting: ['name', 'slug', 'difficulty'],
  })
  .wait();
