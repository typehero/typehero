import Filter from 'bad-words';
import overrideWords from './bad-word-overrides.json';

const f = new Filter();

export function containsProfanity(str: string): boolean {
  f.addWords(...overrideWords);
  return f.isProfane(str);
}
