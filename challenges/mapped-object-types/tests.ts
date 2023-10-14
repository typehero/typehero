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

type Example = MovieInfoByGenre<MoviesByGenre>;

const example: Example = {
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
