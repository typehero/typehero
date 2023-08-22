'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import { useTheme } from 'next-themes';
import { DifficultyBadge, UserBadge } from '@repo/ui';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type MouseEvent } from 'react';
import { Check, Minus, Triangle, X, Reply } from 'lucide-react';
import clsx from 'clsx';
import type { Difficulty } from '@repo/db/types';
import { Markdown } from '../ui/markdown';
import { useIsMobile } from '~/utils/useIsMobile';

type WrapperStyle = MotionStyle & {
  '--x': MotionValue<string>;
  '--y': MotionValue<string>;
};

interface CardProps {
  title: string;
  description: string;
  bgClass?: string;
}

function FeatureCard({
  title,
  description,
  bgClass,
  children,
}: CardProps & {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isMobile = useIsMobile();

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (isMobile) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className="animated-feature-cards relative w-full drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.2)]"
      onMouseMove={handleMouseMove}
      style={
        {
          '--x': useMotionTemplate`${mouseX}px`,
          '--y': useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      <div
        className={clsx(
          'group relative w-full overflow-hidden rounded-3xl border bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 transition duration-300 dark:from-neutral-950/90 dark:to-neutral-800/90',
          !isMobile && 'hover:border-transparent',
          bgClass,
        )}
      >
        <div className="mx-10 my-10 min-h-[450px] w-full">
          <div className="flex w-4/6 flex-col gap-3">
            <h2 className="text-xl font-bold tracking-tight md:text-xl">{title}</h2>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">{description}</p>
          </div>
          {mounted ? children : null}
        </div>
      </div>
    </motion.div>
  );
}

export function ImageCard({
  image,
  imgClass1,
  imgClass2,
  ...props
}: CardProps & {
  imgClass1?: string;
  imgClass2?: string;
  image: {
    dark1: StaticImageData;
    dark2: StaticImageData;
    light1: StaticImageData;
    light2: StaticImageData;
    alt: string;
  };
}) {
  const { resolvedTheme } = useTheme();
  return (
    <FeatureCard {...props}>
      <>
        {resolvedTheme === 'light' && (
          <>
            <Image
              alt={image.alt}
              className={imgClass1}
              src={image.light1}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />
            <Image
              alt={image.alt}
              className={imgClass2}
              src={image.light2}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />
          </>
        )}
        {resolvedTheme === 'dark' && (
          <>
            <Image
              alt={image.alt}
              className={imgClass1}
              src={image.dark1}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />
            <Image
              alt={image.alt}
              className={imgClass2}
              src={image.dark2}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />
          </>
        )}
      </>
    </FeatureCard>
  );
}

const solutionComment = `\`\`\`ts
// CODE START
type Get<T, K> = string
  \`\`\``;

export function CollaborativeEnvironmentCard(props: CardProps) {
  const isMobile = useIsMobile();
  return (
    <FeatureCard {...props}>
      <div className="absolute inset-0 top-[35%] flex w-[100%] flex-col gap-3 pt-4 max-md:scale-90 md:left-[37px] md:top-[30%]">
        <div
          className={clsx(
            'rounded-3xl bg-neutral-500/10 p-4 pt-3 duration-150',
            !isMobile && 'hover:bg-neutral-500/20',
          )}
        >
          <div className="flex items-center gap-2">
            <UserBadge username="abc" linkComponent={Link} />
            <div className="text-xs text-neutral-500">5 years ago</div>
          </div>
          pls halp i give ap
        </div>
        <div
          className={clsx(
            'relative ml-12 rounded-3xl bg-neutral-500/10 p-4 pt-3 duration-150',
            !isMobile && 'hover:bg-neutral-500/20',
          )}
        >
          <Reply className="absolute -left-8 h-4 w-4 opacity-50" />
          <div className="flex items-center gap-2">
            <UserBadge username="defg" linkComponent={Link} />
            <div className="text-xs text-neutral-500">just now</div>
          </div>
          ez, the answer is
          <Markdown>{solutionComment}</Markdown>
        </div>
        <div
          className={clsx(
            'relative ml-12 rounded-tl-3xl bg-neutral-500/10 p-4 pt-3 duration-150',
            !isMobile && 'hover:bg-neutral-500/20',
          )}
        >
          <Reply className="absolute -left-8 h-4 w-4 opacity-50" />
          <div className="flex items-center gap-2">
            <UserBadge username="69" linkComponent={Link} />
            <div className="text-xs text-neutral-500">just now</div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            x="0px"
            y="0px"
            width="150px"
            height="198px"
            viewBox="0 0 150 198"
            enableBackground="new 0 0 150 198"
          >
            <image
              width="150"
              height="198"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAADGCAMAAAAHUYknAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACf1BMVEUAAAAcAAwcAAwcAAwb AAsRAAAbAAscAAscAAwbAAsbAAsaAAobAAsZAAgcAAwbAAsUIDASKDoQKDkTKTkTKDgRIjMSKToS KTkSKDkSKToSKDoQJzoQKToQJjYTKDkSJzkXFCMxOjo2Ozs2Ojw3Ojs1Ozs1OT02PDw3OTw2Ojs2 Ozw3Ojs3OjozMzM2Ojw3OzwcAQw7BAxGBQ1mCA5xCQ5bBw0mAgyGCw+mDhDGERG7EBCbDQ97Cg4x AwywDxBRBg2QDA83Aw8tAhStDhiCCS0hAQ5oBi+pDR9QBCR6CDjBEBORCitcBSqkDSKkFRiOGB1s HSVWICo/Iy80JDITKToTJjcVHy4VHCsXFSMZDRoZCxcbAw4nARG3DxhhHihFBB9+CDUeJzeNCi6v FBabCyazDhq8DxU/AxyICTBuBzIzUWI7W2xUeYtLb4AjPU6CGiBDZXZkjZ90obN8q72Vytyo0+LC 3+rI4+ybzd5cg5WWCym6EhMbM0SEtce12ebv9fj8/Pz1+Pri7/TO5u4rR1igDCRKIS0pSGBQfJvb 7PJsl6liBi2ZFxseOE1HcpRPfaGDts10BzVXhqg4XXp6rcXV6fC73OiMwNSh0OAaM0ZLd5pci6wx U21gkK9tnrro8vYzAhdyo74tTWeu1uRLBCI8YoBWBSdTgaQWLkCQxdhfiZ4iPlNpmbdahJ1Qe5g5 AxmHu9B2qMJ/sclDbY1klbNAaIclQ1o0WHN1CCMUITEaCBQYEB13GyIWGigaBhEpJjQsFyODCTM9 AxKuDh03OzwiDxgpHiQuKC0zMzYrIScmFh4nGiEfCBIdBA81NzkxMDMwLDAsJSohCxUkExv///9F ao9VAAAAMHRSTlMAP3+/jw8vb6/Pn0/fH+9f738/r18P74/fz59PHy+/b78fX6/fjz8vb8/vn08P f7/2AEuIAAAAAWJLR0TUCbsLhQAAAAd0SU1FB+cFDQ8rAm49DU8AAASXelRYdFJhdyBwcm9maWxl IHR5cGUgeG1wAABYhb1YSZLjOAy84xXzBAkkQfE5siXeJmKO/fzJBGVbm7eqiC5HaeECJJYEaMuf f/+Tf/Cn2gUJ11DzkDvrLdjFUo7amVqybMXmMKnO9XK5VMVqjESOpBxSnEIXp9zFgLWDFYlDHjM2 ppDHOKdouENgCNikGmqYoe6ahzDmwbDRJiqzXju+29XmHDgn1AA00SpxhLFN3Jc7kocYjF24I953 aJeGOKVOlOBq9qFgOodOJ+DpAt+6kEPRGZt6UzdeTfWKcQ38hyLcI6694Db5tjHAHFwjRrrdRxcD FSItjEljjLY1TpZJGjjkiA9EwqCa/U/njFXARMyZmqEMH0eiuCquE2WIGR5CRoTokzzAMGjg/BYF ICBYCIVacV8V+AgrbvPi1tcM1xJVc+06GnTxEa8rmx9B0lngwGoTTBmApyN4d3jdi8SWcOKADhDU rhS0WM+FuCZsTAw+TYXWJrg/Cm5Y44TEdPHyGvAzvBA4bYWLSw85xpSt+emdN86FCwZAnIxIYFFN 6rGpbjlYRPHNTMZxZxzUc31LHvmZ/qN6Wetv8k90d+B3Re5guz+dJIS8wHDYfkwOiolM0oSE9KWa KKja9cDto7jOE392Tg7J6xYpQlYFLUcdriLF2O5UcOc8aQ4ygXldiriStBgqzvxWBTKeUQs2Ypfa ZE1kfy5ajrJxVS8n/QvRZEIxy+UmVt5Bfi7W2TeaOckmd7YHsyDcPUp+8njN4N8dgzNqjCw1wY2c PVmBhjvbGkG4i3cH8BveQpqGFIaQQWEKJqoCLHgHKj4VIEqouZgN6vMDAoPwJz7y5YCAKRDyvRbc EGxaha8hEDnN2xGahkAfFHjIPKID7hggJoiIrKxsWSBCBjoTVmBMJC6CFsM7jdmjo0NLa5pAdD2i lbXDvPG4v0Jq1lM8nhO0J48tmhVGevgLY0CDFGhxpo+AiHCwFJhC51NEdGIyeyCoDHxLLrW0BGPk yYYSqZQ9oiJTCguwIwcQUB5qsAKpBvVsUPCeAJZ6Vb61n7VncDjwzAGCXHZNEpmU+8eYcBD6CpA9 Cu7I9nzrXR7yFY15uNitLl6zn+XqI1U/cb1sff/C9SsEORuzeV7zVE6J+ry0rMUxgniC2D6j+Kfo VGVa/bQ6sjjKUh3rNibv3Q/RvbeqxfWy9f1Hrh/ocLANLkaOuetNBbyP7ntmoC6lo7l+ADb1xau/ kM9dL1vff1cj1+Jk6/ufu162vr83prWbuY1+o4J2HKvH8Mgn9OATIwTGnVKEx30eRvvlVM2F7VRm zvoJnQIHByyDMgvOtHZyrBALG9atHsX/pMfzsFn9K8OxszzJOHlhkmNEIbFn5qytkbs5R09035go j+PM70z8IGp7Vp2TSl6x6pveK8fmu+u9bwrajVTyPavOSSW/LWg3UsnnrNJ61or84MxjzYsOtj2Z rJIz3vPrcWiX31bGW2GU7yvj8rVhORvdTiTyOED97kQi79viHcHLM9JfQnQI/PlXZK6STX749/lH fux/xmgzJ7+l0LSWeAwJfweR/wECtfxjLK33zAAADalJREFUeNrFnPlDFOcdxtldbhBqc5ieqUeU S1gBxRU1lpZjABURrU1ACBERtUlj1mhIomKK1gCuqNF60Cx2RVNssTFo06ZNqQseKKL+Q51ddue9 r5lZ+vwGvMeH9/2+z7zHzBsXZ1kOh9PpQhTvdDocCdZLNqvEpOQUN1Ou1CTH7DOlpaa7xUqJT5vF dpsTnyHBFG22zDmzAuVIlmeaUXJmzNss0aUKFVKGM6ZNlqDcUqDJYgeWphBTpFJjBJZpiUqXMwYx lpBqESoUY2m2Y3GolhUWFUe1vHAFDyze5gajB/uKwqKSlR5Mq0pXL2eypdsaYfGUGtYUlazysLR2 9TJGR2baR5VEgSrxCLS2iN5mTruoEomiC0tFUGGtXkPjSrUJCw/31+WgQlpH68tUWwLfgbXUSmmo kEqWxYYrAZnErChWggqpmOxKG/rRiTTVWmUq3TKKSAOz3FjwM+fnq0xQ6SoluKz6BNxYZb8wR+Xx rCQiLNG2xir7pVkqXcsxrBS7Gqu8otIClmcd5q7JVrCgYVilVVvB8qzEuCzMJzKhLtRqLFHpIxIN sAzz7gXN3Wu19TJ1b9hYt6l+cwNdW7Zu3fqrbdu2/fqNN960MBrnAKpGTWsSIm2vb5DWlq3fm/t9 c1jQ1KFZa+Ezbdz0ljxTRC+8+JIZrBS4D1s5TG/XqTOF9fI8dTC0D3ewqbabhAqDzVUFQ/pQY7rW RgtQIb2iGGLQOKzQtDYG1SZrUCHNU6FKgBxe07Sd9KjabJ1Kj32FjkwDWO06Ft0TLHZgVD+Q54qH x6G2K1Y9GOGSxoLsoUOj+8N2RiW7d+/es5fUb/Tfv8PI8kNzoUXDepco/J3fvrfvfS9N+z84ENHB ffs+3EPS/chUaHWSVB+hgfXx3k+8LB06fASo6+inhw56P3nvd0j2l+XCC5pqVelY3STWMaTY479n QnkPHCF0Qif7bLd6N0Ku1UPF6oXL7DvpO8Wk2n+Epq4DB70fwmVI2So0NeqnYsHTheM+32l2Y316 hK6uQ97PFJsLWuLrD0SNnG3BjXXG5/OdZWN9foSlc969UDE/FmNBE9PmEBbx7NmEtJXPd56NtZ+J 1fUHLxT4Eg8hKOIrqFigtAsXdapLXo4OM7k+h7vxFTEWtNOm0bA2gtIuhxprgId1iIl12OuFLOwn CgOxnIoFGfzJENYfeVjec10MrC+8cHTNVRiIfioWGId9ISrfIBfLe/CDA0ePdtE60fs+wPopiybB 4Yh3uZDN7vYwVhMztK7IYEXg/nTgBIq1X//tx6AsKpPDSTuNC4Sx8AcPKOqqTxhbKNoJo9W6zoV+ s4dnEZnJjAOBIRpWLxZavmuyWGG0cydCg/OL/eGfoODCjD7RxT6k6BFg+WZ0VoULESvmHdyTr34+ 1vUI1ukvzWL9mYrlEBzHaXys4QiW74ZZrL9QhqLwNMcvi2W6G/9KwUoRULlHpLHkTILQeR+JlSai iviDFJa5fhykYIkP5IYUsHwDN5WpvrxGYiUIqSL+wLZTBEt/NqoOyEGfbxjHQvpwWfHq0tJVntLS kkLCH4iFD2EQUV1Ti/xT1yhYYIm6ZjV8FABxaQKsBh+u03+Tb7GvdCoI6wVs+vI6ehJQjPsDgQUW Y7d8pL6Wi7GbA+HUAGsuGlorsPMJsI0+wsACE5szPppO3/jqPJ/p1OClSNo+DMsILfzUEnRigIEF FonHfSxdujF4itafN8/euASnwx/V0Qn7Gg8Ta4iBVceMeXwIDAx8PQg0MHANT3EVYL2EhFYRG6uH gQXtP1z1WRMIrcgaIzqbWcfG6mBgQTObYWtUo6CkeWjEEwdy4MBBY2BBDtEwaoXqYh8eWg5WaHnc Yixod7LPni6M9mF0K7kwXE91W2V3d3dNa836NhkseMvtuGmoi7ehYuaiHl+sM63fpUEyqMqYWMiG zRmTVKMXoEKiO1zRgVjStENDhZs8bTMQ2XS7Y6qpLsNFNLwamdVETwv/rmkmsNDt3Nu3lKHuXEdK MHZ1MW9SxHobKbThulqD3bqCQoENiEQsrBWxPPgx3bC0r56809eA60VjyWMRq5couu/MSXEzXb5y oYEU2AqM+kO5SSzqtvzwZY653rp6nIaEUBkPaj9B1Y/PaxiniYxDjOHbd0ZHL6LdNnr5yvD1Bpbg fcBkJlYPPq9hHXLachDVsOVntJ01C1gf2cH1zT9cMFa6dSwbDqO++afbnUHb8LOE5fnWWv9tC1cD Uc1RweKc628w35Fb/vVvN47lUMHSPBxt/M4U1Ob/vBmthobVbhVLd9Zjqkxvbe+Fln3Qe1NOomrz WPqYfFeBbHPdhlAegOUwi7VTxBXqzLp64dn1d8fqeqPp19GwkpWw2iSwwq3WW1dXX08G2+b6+rpv ezcgaUtpWK6YYKnIBiyp16RUZVQDvTTlVsLqtg7BwXKaxeq0DiGFlaCG1WodgtQyEsuhhjUWC6xC y1haLLD+S2KlKWLFwCGq/SQWOIyulcKy9DIsXXfbeVg9Ulg7rGPg6g5Yx4rBUGylYMUrYmn2Y2kG FpjMuzhYHTQs4euwqrqriqXRsGx/KnbagmX1VWtCY7ZgaTZTNWn2YN21F2uHBawR6Jc2TyLGLGDB i7UW6yhoHwKsVAtY9j5/OmEspxUsO42+usU2LDsdtVKzD8vGoA8fA/jtwZJaxEppp8bAAq8a1Mpj 2dZcnSwsMLEJyGPZFV0zjaWVm8XCd6FtGozdWDWqWMSevS3ziLA7wNVkWsVqsSPqI40FZptgDwK8 httMYpUxsbRd1r5wgxuLhgXWieQmJRgilIMX61yRxtKG7MRifJYhr7ZoQQFbsSy6V1NLtJxmoxbo o0A3p2o+ltZqoR93tlBqiVPF6qdy7TJtq01jtIEFYWVwqgZYPVQsrcXkDLqtBSrETcPiPauFWPpC yIyBVcIlgNUo/N0weCO+1gyW1qJs+NXoCwTAtuATMp7Ny2Bp2pgaWNsYmr2KigU+P2w3iRVqMekx eXcMzwz8Af6Gn2dcslihGJMJ/urKMY1TCXylBvRyJydHlQhLb7KaSr5ftHWO0fI1GpUg3zIDh6hg t29AjBVGa+2+S2NrauuuYeUBzYLc1gUcYgjPEVDFmtFYa2u3oZrW1jFeYuAPbuQeGTAUiZg3iaUk 4A+wm8J7zY3/X6x0BAuKeTy4AJbfVJUyAnUg7xvA1yo0M7PMBhZ29QjY1W3sZ2WJHRYY7UlxjODC x+JsYAFvxG/zc7Oaa3ax8AsroM/qUDevmgUsxkBEe7EcGYyQp8Qey4VjwVecIFyzgAVMnrz7Cr49 pxGaLMwCFqiCvHQEuWvI7a/t0TUUaPeX2Y/V0VMbgKfBYO1KuQEIuZmJKokaawMB/d+poMPoNAG/ P7xlhDx6wWAnqbB7rMxhAV90l/lhNaIlod5o+AP1XiLhZ1H9IqoOUQm0oQ5tudFv44oXFCecNVe5 ZVTWgeYCL2syLqETfK8lxGp3SyiAN3qt8SfWRbJJ3AKFWH63UOVkISDimVccOnhxbwOWv5+TKyOO qQSn6NNX81j+ZmoJxt9dcTxlumKBVdbcQc9UYSQRXT+X4HDqIj4ZFk7mWVj+kSG2uYDhmxSnIJd1 LG4mMHyVbnSON4OVgnxWz80EHgBKl5Y5zWA5EHPm5QFmmq5CxX1fiYeVKYcFzNSlhJVoEgu6ooT3 MAVmqnj/qUkskI/rLCCP4sVzRr4RNax0KSxj+qB6C6ThEMKlD8CaA+fj7YwBM3WrUYHiG+WxQvmk nAVMmNUiHl5CqmEBZ+E0MzBT1Rt/nSaxOLtTQGAFo3prvzxWOYIFXb3LdAhgpqqhBflihwALq0PC IcyaKfJfi2Y2gCMYEviRGfMgtJRvPTWNNS6MeagP1e+4lhnoKNY4hsXqfmhNon4Xq1msCVBpOzU9 MC3FWU1YxiUkgqdPB4Z1D6q1WUCletHv/AULjc4QPH16MKz7ULXuMjwwO0bgPz9Y9NpiaaYlWdl6 8Q+jectlsSbDWMFHbgQs0GP4V8cQAuV+PKUnz8nNWyoBtSA7iMUIHwssFiZmMk66ZRXJoJPN5zMt XbAokhSKEb5DBPBanshSPZoKGspdwqHKzwEJpyWx/Ea66UjOcUms6SCsAhbY/Gw42ZSRnesQ/WQ1 ks01EcSURY/0HDSVHBY03o2cT2WoHgYJ5UpQBaUcogLMH56BrM/FVJPBoBRXNp7GcAh3Bbutyqn/ /pQovB5PB6nKIxqLSAK6opzOVdFcDlf1AA5Mvks8nKJTBRfiWFlEEsiuy7GNl9Bmth+v6wmae/IR C+o5o6l05eBYi8k0z+CyyvyBqNobaZU9Igt4Mv1g4vk4hPd4fGLi3v0gWwVEbOUQaR7IDChD99iV 3Z+e0ZOgSKRH5BNpph7LQz1+KqxSQjmUp2MukWpCmooZw2pUNKNfSnJJ+aIbHYQWqBiTnDwivu7J 9OP4fTMQhBYy5zdL83GwqUkR2KQ9UAXc+SAF7MEzNtOzCVuCSgA142BEjN1/+pyCNv7wqXjEy2hR lsz0VG+yvFzSxaanJ4CeSniQnLKzlkgxRbQkqyDHeqUCJLlpPImWn7soNkQF+fmmkAzNz3utwFai RQuz5FdhgmGwOCu3INsiT05BQX7e4vnWaUi6Bfn56jGXnZufvzgWPHTA/NwCjvS/q8P8D02xG212 RxoxAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA1LTEzVDE1OjQzOjAyKzAwOjAw6VGydAAAACV0 RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNS0xM1QxNTo0MzowMiswMDowMJgMCsgAAAAodEVYdGRhdGU6 dGltZXN0YW1wADIwMjMtMDUtMTNUMTU6NDM6MDIrMDA6MDDPGSsXAAAAAElFTkSuQmCC"
            />
          </svg>
        </div>
      </div>
    </FeatureCard>
  );
}

export function CuratedTracksCard(props: CardProps) {
  return (
    <FeatureCard {...props}>
      <div
        className={clsx(
          'absolute inset-0 top-[90%] flex flex-col items-center justify-center gap-1',
          'max-md:scale-125 md:top-[38%]',
        )}
      >
        <div className="flex w-[69%] items-center justify-between gap-3 rounded-b-lg rounded-t-2xl bg-neutral-500/10 p-2 pl-3">
          <span className="text-sm font-medium">Track name</span>
          <div className="flex items-center gap-3">
            <Minus className="h-3 w-3" />
            <Triangle className="h-3 w-3" />
            <X className="h-3 w-3" />
          </div>
        </div>

        {tracks.map((track) => (
          <Track key={track.id} {...track} />
        ))}
      </div>
    </FeatureCard>
  );
}

interface Track {
  className?: string;
  difficulty: Difficulty;
  id: string;
  label: string;
}

const tracks: Track[] = [
  {
    id: '1',
    label: 'Awaited',
    difficulty: 'BEGINNER',
    className: 'peer-checked/1:bg-pink-300/50 peer-checked/1:hover:bg-pink-300/50',
  },
  {
    id: '2',
    label: 'Unshift',
    difficulty: 'EASY',
    className: 'peer-checked/2:bg-emerald-300/50 peer-checked/2:hover:bg-emerald-300/50',
  },
  {
    id: '3',
    label: 'Append Argument',
    difficulty: 'MEDIUM',
    className: 'peer-checked/3:bg-yellow-300/50 peer-checked/3:hover:bg-yellow-300/50',
  },
  {
    id: '4',
    label: 'CamelCase',
    difficulty: 'HARD',
    className: 'peer-checked/4:bg-red-300/50 peer-checked/4:hover:bg-red-300/50',
  },
  {
    id: '5',
    label: 'Get Readonly Keys',
    difficulty: 'EXTREME',
    className: 'peer-checked/5:bg-orange-300/50 peer-checked/5:hover:bg-orange-300/50',
  },
];

function Track({ className, difficulty, id, label }: Track) {
  const isMobile = useIsMobile();
  return (
    <>
      <input className={`peer/${id} appearance-none`} type="checkbox" id={id} />
      <label
        htmlFor={id}
        className={clsx(
          'flex w-[69%] cursor-pointer items-center justify-between gap-3 rounded-lg bg-neutral-500/10 p-4 text-zinc-700 duration-300 active:scale-100 active:duration-75  dark:text-zinc-300',
          className,
          !isMobile && 'hover:scale-105 hover:rounded-xl group-hover:hover:bg-neutral-500/20',
        )}
      >
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-lg">
            <Check className="h-3 w-3" />
          </div>
          {label}
        </div>
        <div className="group">
          <DifficultyBadge difficulty={difficulty} />
        </div>
      </label>
    </>
  );
}
