import AWS from "aws-sdk";

const sender = process.env.SES_SENDER!;
const receiver = process.env.SES_RECEIVER!;

const SES = new AWS.SES();

/**
 * Sends email to a verified email address
 */
export default function (subject: string, message: string, to = receiver): Promise<void> {
  console.log(`Send email from ${sender} to ${to}`);
  const emailParams = {
    Source: sender, // SES SENDING EMAIL
    Destination: {
      ToAddresses: [
        to, // SES RECEIVING EMAIL
      ],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };
  return SES.sendEmail(emailParams)
    .promise()
    .then(() => console.log(`Sent email from ${sender} to ${to}`))
    .catch((error) => console.error(`Failed to send email from ${sender} to ${to}: ${error}`));
}
