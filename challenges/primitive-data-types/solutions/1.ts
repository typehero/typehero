const playSong = (name: string, year: number) => {
  return `${name} was released in the year ${year}`;
};

const name: string = 'Frank Zappa';

const age: number = 52;

interface Musician {
  name: string;
  age: number;
  deceased: boolean;
}

const musicianInfo = ({ name, age, deceased }: Musician) => {
  return `${name}, age ${age}${deceased ? ' (deceased)' : ''}`;
};

musicianInfo({
  name,
  age,
  deceased: true,
});
