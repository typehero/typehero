import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

// so that we can access the assets from the typehero vercel app
// but when in local most we point to the web app running on localhost
const baseUrl =
  process.env.NODE_ENV === 'production' ? `https://typehero.dev` : 'http://localhost:3000';

export const UserSignupEmail = (props: { to: string }) => {
  return (
    <Html>
      <Head />
      <Preview>You're on the TypeHero Waitlist!</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img src={`${baseUrl}/typehero.png`} width="64" height="auto" alt="TypeHero" />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-[24px] font-bold text-black">
              You're on the TypeHero Waitlist!
            </Heading>
            <Text className="pb-2 text-[20px] leading-[24px] text-black">Hey there 👋</Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Thank you so much for signing up for the typehero waitlist, we really appreciate it.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              We are cooking extremely hard to bring you the best experience for doing type
              challenges.
            </Text>
            <Container className="mx-auto w-fit pt-4">
              <Button
                pX={20}
                pY={12}
                className="rounded bg-[#3178c6] text-center text-[12px] font-semibold text-white no-underline"
                href="https://twitter.com/typeheroapp"
              >
                Follow us on @X
              </Button>
            </Container>
            <Container className="mt-6">
              <a
                className="text-[14px] leading-[24px] text-black"
                href={`${baseUrl}/unsubscribe?email=${props.to}`}
              >
                Unsubscribe from the waitlist
              </a>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
