import type { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

interface RedirectIfOptions {
  unauthenticated?: boolean;
  is?: UserType;
  not?: UserType;
}

export const redirectIf =
  (conditions: RedirectIfOptions, redirect: string = '/home') =>
  async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);

    if (conditions.unauthenticated) {
      // if (fullSession) {
      //   return {
      //     redirect: {
      //       destination: redirect,
      //       permanent: false,
      //     },
      //   };
      // }
    } else if (!fullSession) {
      // return {
      //   redirect: {
      //     destination: `/auth/signin?redirect=${encodeURIComponent(ctx.resolvedUrl)}`,
      //     permanent: false,
      //   },
      // };
    }

    if (
      (conditions.is && session?.user?.type === conditions.is) ||
      (conditions.not && session?.user.type !== conditions.not)
    ) {
      return {
        redirect: {
          destination: redirect,
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  };

export const authenticatedRoute = redirectIf({});
export const unauthenticatedRoute = redirectIf({ unauthenticated: true });

export const creatorRoute = redirectIf({ not: UserType.CREATOR }, '/creator/apply');

export const creatorPendingRoute = redirectIf({ not: UserType.CREATOR_PENDING }, '/creator');

export const nonCreatorRoute = redirectIf({ is: UserType.CREATOR }, '/creator');
