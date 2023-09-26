import type { Page } from '@playwright/test';
import os from 'node:os';

export async function ctrlC(page: Page): Promise<void> {
  const isMac = os.platform() === 'darwin';
  const modifier = isMac ? 'Meta' : 'Control';
  await page.keyboard.press(`${modifier}+KeyC`);
}

export async function ctrlV(page: Page): Promise<void> {
  const isMac = os.platform() === 'darwin';
  const modifier = isMac ? 'Meta' : 'Control';
  await page.keyboard.press(`${modifier}+KeyV`);
}

export const wrapTypescriptCode = (text: string) => {
  return `\n\`\`\`ts\n${text}\n\`\`\``;
};
