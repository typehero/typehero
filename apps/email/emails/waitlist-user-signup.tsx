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

// so that we can access the assets from the typehero-email vercel app that is running as a "static site"
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? `https://email.typehero.dev`
    : 'http://127.0.0.1:6969/static';

export const UserSignupEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>You're on the Typehero Waitlist!</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img src={`${baseUrl}/typehero.png`} width="64" height="auto" alt="Typehero" />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-[24px] font-bold text-black">
              You're on the Typehero Waitlist!
            </Heading>
            <Text className="pb-2 text-[20px] leading-[24px] text-black">Hey there 👋</Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Thank you so much for signing up for the typehero waitlist, we really apperciate it.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              We are cooking extremelly hard to bring you the best experience for doing type
              challenges.
            </Text>
            <Container className="w-fit mx-auto pt-4">
              <Button
                pX={20}
                pY={12}
                className="rounded bg-[#3178c6] text-center text-[12px] font-semibold text-white no-underline"
                href="https://twitter.com/typeheroapp"
              >
                Follow us on @X
              </Button>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default UserSignupEmail;
