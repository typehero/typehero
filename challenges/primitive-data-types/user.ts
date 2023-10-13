const playSong = (
  name,
  year,
) => {
  return `${name} was released in the year ${year}`;
};

const name = 'Frank Zappa';

const age = 52;

interface Musician {
  name: string;
  age: number;
  deceased: boolean;
}

const musicianInfo = ({
  name,
  age,
  deceased,
}: Musician) => {
  return `${name}, age ${age}${deceased ? ' (deceased)' : ''}`;
};

musicianInfo({
  name,
  age,
});