import mailchimp from '@mailchimp/mailchimp_marketing';

const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

export async function POST(req: Request) {
  const { name: NAME, email, intention: REASON } = await req.json();

  const merge_fields = {
    NAME,
    REASON,
  };

  try {
    const response = await mailchimp.lists.addListMember(AUDIENCE_ID!, {
      email_address: email,
      status: 'subscribed',
      merge_fields,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error) {
    // @ts-ignore
    return new Response(error.response.text, {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}
