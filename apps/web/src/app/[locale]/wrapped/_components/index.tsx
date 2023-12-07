'use client';

import { Banner } from './banner';
import { Hello } from './hello';

import { MostLoved } from './most-loved';
import { MostSolved } from './most-solved';
import { MostTricky } from './most-tricky';

export async function TypeHeroWrapped() {
  return (
    <div className="h-full w-full ">
      <Banner />
      <Hello />
      <MostLoved />
      <MostSolved />
      <MostTricky />
    </div>
  );
}
