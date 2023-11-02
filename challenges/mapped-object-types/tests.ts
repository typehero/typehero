import { Expect, Equal } from 'type-testing';

type MoviesByGenre = {
  action: 'Die Hard';
  comedy: 'Groundhog Day';
  sciFi: 'Blade Runner';
  fantasy: 'The Lord of the Rings: The Fellowship of the Ring';
  drama: 'The Shawshank Redemption';
  horror: 'The Shining';
  romance: 'Titanic';
  animation: 'Toy Story';
  thriller: 'The Silence of the Lambs';
};

const test_MoviesInfoByGenre: MovieInfoByGenre<MoviesByGenre> = {
  action: {
    name: 'Die Hard',
    year: 1988,
    director: 'John McTiernan',
  },
  comedy: {
    name: 'Groundhog Day',
    year: 1993,
    director: 'Harold Ramis',
  },
  sciFi: {
    name: 'Blade Runner',
    year: 1982,
    director: 'Ridley Scott',
  },
  fantasy: {
    name: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
    director: 'Peter Jackson',
  },
  drama: {
    name: 'The Shawshank Redemption',
    year: 1994,
    director: 'Frank Darabont',
  },
  horror: {
    name: 'The Shining',
    year: 1980,
    director: 'Stanley Kubrick',
  },
  romance: {
    name: 'Titanic',
    year: 1997,
    director: 'James Cameron',
  },
  animation: {
    name: 'Toy Story',
    year: 1995,
    director: 'John Lasseter',
  },
  thriller: {
    name: 'The Silence of the Lambs',
    year: 1991,
    director: 'Jonathan Demme',
  },
};

type test_MovieInfoByGenre = Expect<Equal<
  MovieInfoByGenre<MoviesByGenre>,
  {
    action: {
        name: string;
        year: number;
        director: string;
    };
    comedy: {
        name: string;
        year: number;
        director: string;
    };
    sciFi: {
        name: string;
        year: number;
        director: string;
    };
    fantasy: {
        name: string;
        year: number;
        director: string;
    };
    drama: {
        name: string;
        year: number;
        director: string;
    };
    horror: {
        name: string;
        year: number;
        director: string;
    };
    romance: {
        name: string;
        year: number;
        director: string;
    };
    animation: {
        name: string;
        year: number;
        director: string;
    };
    thriller: {
        name: string;
        year: number;
        director: string;
    };
  }
>>;
