// this is to data to populate the description tab (default tab on challenge page)
export const getChallengeRouteData = async (slug: string, session: Session | null) => {
  const challenge = await prisma.challenge.findFirstOrThrow({
    where: {
      slug,
      status: 'ACTIVE',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          roles: true,
          bio: true,
          image: true,
        },
      },
      _count: {
        select: {
          vote: true,
        },
      },
      vote: {
        where: {
          userId: session?.user?.id || '',
        },
      },
      bookmark: {
        where: {
          userId: session?.user?.id || '',
        },
      },
    },
  });
};

//
