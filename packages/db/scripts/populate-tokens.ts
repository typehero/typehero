import { prisma } from '../src';

const TOKEN_LIMIT = 3069;

function generateRandomStr() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function populateTokens() {
  await prisma.betaTokens.deleteMany();
  await prisma.betaTokens.createMany({
    data: Array.from(new Array(TOKEN_LIMIT).keys()).map(() => {
      return {
        token: generateRandomStr(),
      };
    }),
  });
}

populateTokens();
