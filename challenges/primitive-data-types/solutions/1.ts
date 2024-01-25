const playSong = (artistName: string, year: number) => {
  return `${artistName} was released in the year ${year}`;
};

const artistName: string = 'Frank Zappa';

const age: number = 52;

interface Musician {
  artistName: string;
  age: number;
  deceased: boolean;
}

const musicianInfo = ({ artistName, age, deceased }: Musician) => {
  return `${artistName}, age ${age}${deceased ? ' (deceased)' : ''}`;
};

musicianInfo({
  artistName,
  age,
  deceased: true,
});
