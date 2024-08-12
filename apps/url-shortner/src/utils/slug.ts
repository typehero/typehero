import { customAlphabet } from 'nanoid';

// removed confusing characters from the alphabet for the URL (0, O, I, l)
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
export function newSlug(): string {
  const nanoid = customAlphabet(alphabet, 7);
  return nanoid();
}
