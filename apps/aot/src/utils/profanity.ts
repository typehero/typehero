import Filter from 'bad-words';
import overrideWords from './bad-word-overrides.json';

const f = new Filter();
f.addWords(...overrideWords);

export function containsProfanity(str: string): boolean {
  return f.isProfane(str);
}
