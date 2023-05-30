import { type NextPage } from 'next';
import Head from 'next/head';
import { TypographyH1 } from '~/components/h1';
import { Navigation } from '~/components/navigation';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Type Hero</title>
        <meta
          name="description"
          content="Level up your typescript skills with interactive exercises"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <header>
        <TypographyH1>TypeHero</TypographyH1>
      </header>
    </>
  );
};

export default Home;
