import axios from 'axios';
import { prisma } from '../src';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let counter = 0;
let baddies = 0;

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date('2023-11-13T00:00:00Z'),
        },
      },
      include: {
        accounts: {
          select: {
            providerAccountId: true,
          },
          take: 1,
        },
      },
    });

    for (const user of users) {
      await sleep(1000);
      const accountId = user.accounts[0];
      const githubUser = await axios.get(
        `https://api.github.com/user/${accountId?.providerAccountId}`,
        // https://github.com/settings/tokens
        {
          headers: { Authorization: 'token <token>' },
        },
      );
      const { login } = githubUser.data;
      console.log({ login });

      if (login === user.name) continue;

      try {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: login,
          },
        });
        counter++;
      } catch (e) {
        console.log(`this record didnt work ${user.id}`);
        baddies++;
      }
    }

    console.log({ counter, baddies });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getUsers();
