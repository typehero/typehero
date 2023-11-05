import { getServerAuthSession } from "@repo/auth/server";
import { notFound } from "next/navigation";
import { getSolutionsRouteData } from "~/app/[locale]/challenge/[id]/solutions/getSolutionRouteData";
import { withUnstableCache } from "~/utils/withUnstableCache";

interface Props {
  params: {
    id: string;
  }
}

export default async function({ params: { id }}: Props ) {
  await new Promise(res => {
    setTimeout(() => res(void 0), 2000);
  });

  return 'solutions list here';
}