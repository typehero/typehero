import { prisma } from '../src';

/**
 * Usage: npx tsx ./create-notifications.ts 3660667 144733469 <--- must be two valid user ids
 * To quickly create your notification data
 */
const [toUserId, fromUserId] = process.argv.slice(2);

const notis = [
  {
    type: 'LIKE',
    blurb: (i: number) => `liked your comment ${i}`,
  },
  {
    type: 'MENTION',
    blurb: (i: number) => `mentioned you in a comment ${i}`,
  },
  {
    type: 'REPLY',
    blurb: (i: number) => `replied to you ${i}`,
  },
];

const notifications = Array(20)
  .fill(null)
  .map((_, i) => {
    const index = Math.floor(Math.random() * 3);
    return {
      url: '',
      toUserId,
      fromUserId,
      blurb: notis[index]?.blurb(i),
      type: notis[index]?.type,
    };
  }) as any[];

await prisma.notification.createMany({
  data: notifications,
});
