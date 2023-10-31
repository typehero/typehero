import { test, expect } from '@playwright/test';
import { prisma } from '@repo/db';
import { USER } from '../constant';
import { ctrlV, wrapTypescriptCode } from '../helpers';

test.describe('create, edit, and delete comments', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/pick');
    await page.getByRole('button', { name: 'Comments' }).click();
  });

  const commentNumber = Math.floor(Math.random() * 1000);
  const parentComment = `Here is my comment ${commentNumber}`;
  const parentCodeText = `const comment${commentNumber} = true`;
  const editedParentComment = `Here is my edited comment ${commentNumber}`;

  const replyNumber = Math.floor(Math.random() * 1000);
  const replyComment = `Here is my reply ${replyNumber} to comment ${commentNumber}`;
  const replyCodeText = `const reply${replyNumber} = true`;
  const editedReplyComment = `Here is my edited reply ${replyNumber} to comment ${commentNumber}`;

  test('comment on challenge', async ({ page }) => {
    await page
      .getByPlaceholder('Enter your comment here.')
      .fill(`${parentComment}${wrapTypescriptCode(parentCodeText)}`);
    await page.getByRole('button', { name: 'Comment', exact: true }).click();

    await expect(page.getByText(`${parentComment} ${parentCodeText}`)).toBeVisible();
  });

  test('reply to parent comment', async ({ page }) => {
    const commentBlock = page.locator('div[id^=comment]', {
      hasText: `${parentComment} ${parentCodeText}`,
    });
    await commentBlock.getByRole('button', { name: 'Create a reply' }).click();

    await page.locator('*:focus').fill(`${replyComment}${wrapTypescriptCode(replyCodeText)}`);
    await page.getByRole('button', { name: 'Comment', exact: true, disabled: false }).click();

    await expect(page.getByText(`${replyComment} ${replyCodeText}`)).toBeVisible();
  });

  test('edit parent comment', async ({ page }) => {
    const commentBlock = page.locator('div[id^=comment]', {
      hasText: `${parentComment} ${parentCodeText}`,
    });
    await commentBlock.getByRole('button', { name: 'Edit this comment' }).click();

    await page
      .locator('*:focus')
      .fill(`${editedParentComment}${wrapTypescriptCode(parentCodeText)}`);
    await page.getByRole('button', { name: 'Comment', exact: true, disabled: false }).click();

    await expect(page.getByText(`${editedParentComment} ${parentCodeText}`)).toBeVisible();
  });

  test('edit reply', async ({ page }) => {
    const commentBlock = page.locator('div[id^=comment]', {
      hasText: `${editedParentComment} ${parentCodeText}`,
    });
    await commentBlock.getByRole('button', { name: '1 reply' }).click();

    const replyBlock = page.locator('div[id^=comment]', {
      hasText: `${replyComment} ${replyCodeText}`,
    });
    await replyBlock.getByRole('button', { name: 'Edit this comment' }).click();

    await page.locator('*:focus').fill(`${editedReplyComment}${wrapTypescriptCode(replyCodeText)}`);
    await page.getByRole('button', { name: 'Comment', exact: true, disabled: false }).click();

    await expect(page.getByText(`${editedReplyComment} ${replyCodeText}`)).toBeVisible();
  });

  test('delete reply', async ({ page }) => {
    const commentBlock = page.locator('div[id^=comment]', {
      hasText: `${editedParentComment} ${parentCodeText}`,
    });
    await commentBlock.getByRole('button', { name: '1 reply' }).click();

    const replyBlock = page.locator('div[id^=comment]', {
      hasText: `${editedReplyComment} ${replyCodeText}`,
    });
    await replyBlock.getByRole('button', { name: 'Delete this comment' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(
      commentBlock.getByText(`${editedReplyComment} ${replyCodeText}`),
    ).not.toBeVisible();
  });

  test('delete parent comment', async ({ page }) => {
    const commentBlock = page.locator('div[id^=comment]', {
      hasText: `${editedParentComment} ${parentCodeText}`,
    });
    await commentBlock.getByRole('button', { name: 'Delete this comment' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(
      page.getByLabel('Description').getByText(`${editedParentComment} ${parentCodeText}`),
    ).not.toBeVisible();
  });
});

test.describe('sharing comments', () => {
  const commentNumber = Math.floor(Math.random() * 1000);
  const parentComment = `Here is my comment ${commentNumber}`;

  test('share comment and navigate to comment link', async ({ page, context }) => {
    const comment = await prisma.comment.create({
      data: {
        rootChallengeId: 3,
        text: parentComment,
        userId: USER.id,
      },
    });

    await page.goto('/challenge/omit');
    await page.getByRole('button', { name: 'Comments' }).click();

    const commentBlock = page.locator('div[id^=comment]', { hasText: parentComment });
    await commentBlock.getByText('Share this comment').click();

    await page.getByPlaceholder('Enter your comment here.').focus();
    await ctrlV(page);
    await expect(page.getByText(`${page.url()}/comments/${comment.id}`)).toBeVisible();

    await page.goto(`${page.url()}/comments/${comment.id}`);
    await expect(page.locator('div[id^=comment]', { hasText: parentComment })).toBeVisible();
  });

  test('visiting a link to a deleted comment successfully loads page with remaining comments', async ({
    page,
  }) => {
    const commentA = await prisma.comment.create({
      data: {
        rootChallengeId: 6,
        text: 'to be deleted',
        userId: USER.id,
      },
    });

    await prisma.comment.create({
      data: {
        rootChallengeId: 6,
        text: 'this comment is timeless',
        userId: USER.id,
      },
    });

    // delete comment A
    await prisma.comment.delete({ where: { id: commentA.id } });
    // but visit a deep link to it anyway
    await page.goto(`/challenge/simple-vue/comments/${commentA.id}`);
    // assert other comments, such as comment B, are still visible on page load
    await expect(
      page.locator('div[id^=comment]', { hasText: 'this comment is timeless' }).first(),
    ).toBeVisible();
  });
});
