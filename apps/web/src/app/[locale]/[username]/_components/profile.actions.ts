'use server';

import { getServerAuthSession } from "@repo/auth/server";
import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { UserLinkSchemaType } from "./edit_user_links";
import type { UserBioSchemaType } from "./edit_user_bio";



// todo: this isn't correct behaviour, we should never use findFirst for username.
// it should be findUnique. this is a good first issue for someone willing to refactor
// the places after editing schema.
export type UserProfile = Awaited<ReturnType<typeof getPublicProfile>>;
export async function getPublicProfile(username: string) {
  return prisma.user.findFirst({
    where: {
      name: username,
    },
    select: {
      createdAt: true,
      bio: true,
      image: true,
      name: true,
      userLinks: true,
      submission: {
        select: {
          challenge: {
            select: {
              name: true,
              difficulty: true,
              shortDescription: true
            }
          },
          isSuccessful: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      },
    },
  });
}

export type UserPrivateProfile = Awaited<ReturnType<typeof getPrivateProfile>>;
export async function getPrivateProfile() {
  const auth = await getServerAuthSession();

  if (!auth?.user.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email: auth.user.email
    },
    select: {
      bookmark: {
        select: {
          challenge: {
            select: {
              id: true,
              name: true,
              shortDescription: true,
              difficulty: true,
              user: {
                select: {
                  name: true
                }
              },
              updatedAt: true,
              _count: {
                select: {
                  comment: true,
                  vote: true
                }
              }
            }
          },
        },
      }
    }
  });
}

export async function updateUserLinks(data: UserLinkSchemaType) {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("You are not authorized to perform this action.");

  await prisma.$transaction(
    data.userLinks.map((link) =>
      prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          userLinks: {
            connectOrCreate: {
              where: {
                url: link.url,
              },
              create: {
                url: link.url
              }
            }
          }
        }
      }
      ),
    )
  );

  revalidatePath(`/@${session.user.name}`);
}

export async function updateUserBio(data: UserBioSchemaType) {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("You are not authorized to perform this action.");

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      bio: data.bio
    }
  })

  revalidatePath(`/@${session.user.name}`);
}
