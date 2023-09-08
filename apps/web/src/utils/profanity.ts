import Filter from 'bad-words';
import overrideWords from './bad-word-overrides.json';


export function containsProfanity(str: string): boolean {
    const f = new Filter();
    f.addWords(...overrideWords);
    return f.isProfane(str);
}