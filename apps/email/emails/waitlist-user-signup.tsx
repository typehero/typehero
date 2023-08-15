import {
  Body,
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

// This means we'd deploy all the email assets to a static host
// so that we can access them from a CDN
const baseUrl = process.env.NODE_ENV === "production" ? `https://email.typehero.dev` : 'http://localhost:3000';

export const UserSignupEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Thanks for joining the Typehero waitlist</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/typehero.png`}
                width="40"
                height="37"
                alt="Typehero"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-bold text-black">
              You're on the Waitlist!
            </Heading>
            <Text className="pb-2 text-[20px] leading-[24px] text-black">Hey there 👋</Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Thank you so much for signing up for the typehero waitlist, we really apperciate it.
            </Text>
            <Img
              src={`${baseUrl}/signup.gif`}
              alt="Nods Yes Gif"
              className="mx-auto my-0"
            />
            <Text className="text-[14px] leading-[24px] text-black">
              We are cooking extremelly hard to bring you the best experience for doing type
              challenges.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default UserSignupEmail;
