import { customAlphabet } from 'nanoid';

// removed confusing characters from the alphabet (0, O, I, l) for the URL
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';

export function newShortURLSlug(): string {
  const nanoid = customAlphabet(alphabet, 7); // fixed slug size = 7
  return nanoid();
}
