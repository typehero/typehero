type MovieInfoByGenre<T> = {
  [K in keyof T]: {
    name: string;
    year: number;
    director: string;
  };
};
