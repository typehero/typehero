import { prisma } from '.';
import mailchimp from '@mailchimp/mailchimp_marketing';

function generateRandomStr() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const TOKEN_LIMIT = 2500;

async function populateTokens() {
  await prisma.betaTokens.deleteMany();
  await prisma.betaTokens.createMany({
    data: Array.from(new Array(TOKEN_LIMIT).keys()).map(() => {
      return {
        isClaimed: false,
        token: generateRandomStr(),
      };
    }),
  });
}

async function sendMailchimpEmails() {
  // loop through mailingt list
  // grab templateId from sendMailchimpEmails
  // use sdk send(email, templateId)
}

populateTokens();

// const run = async () => {
//   const response = await mailchimp.templates.render({
//     template_name: 'template_name',
//     template_content: [{ name: 'name', content: 'content' }],
//   });
//   console.log(response);
// };

// run();

// const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

const listId = '1085130';
async function sendEmails() {
  const members = await mailchimp.li
  console.log({ members });

  // // For simplicity, let's just send an email to the first member
  // // In reality, you might want to loop through all members or filter based on some criteria
  // const member = members[0];
  //
  // // Set email content (assuming you're using a template)
  // await mailchimp.campaigns.setContent(grabThisFromTheSite, {
  //   template: {
  //     id: YOUR_TEMPLATE_ID,
  //     sections: {
  //       // Your template content sections here
  //     },
  //   },
  // });
  //
  // // Send the campaign
  // await mailchimp.campaigns.send(grabThisFromTheSite);
}

sendEmails()
  .then(() => {
    console.log('Emails sent!');
  })
  .catch((error) => {
    console.error('Error sending emails:', error);
  });



  function updateTokenOnUser() {
    mailchimp.lists.
  }