// https://github.com/algolia-samples/api-clients-quickstarts/blob/master/javascript/indexing.js

import { prisma } from '../src';
import algoliasearch from 'algoliasearch';

console.log({
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
  ALGOLIA_TYPEHERO_KEY: process.env.ALGOLIA_TYPEHERO_KEY,
});

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_TYPEHERO_KEY!);
const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME!);

const challenges = await prisma.challenge.findMany();

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
