import * as AWS from 'aws-sdk';
import nodemailer from 'nodemailer';
import { Consumer } from 'sqs-consumer';

//itemName, itemPrice, itemQuantity
interface InfoMessage {
  userEmail: string;
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
}

let transport = nodemailer.createTransport({
  host: 'smtp.googlemail.com',
  port: 587,
  //Mudar isso depois
  auth: {
    user: 'EMAIL_ADDRESS',
    pass: 'EMAIL_PASSWORD',
  },
});

function sendMail(message: AWS.SQS.Message) {
  let sqsMessage: InfoMessage = JSON.parse(Object(message.Body));
  const emailMessage = {
    from: '',
    to: sqsMessage.userEmail,
    subject: 'Order Received | NodeShop',
    html: `<p>Hi ${sqsMessage.userEmail}.</p> <p>Your order of ${sqsMessage.itemQuantity} ${sqsMessage.itemName} has been received and is being processed.</p> <p> Thank you for shopping with us! </p>`,
  };

  transport.sendMail(emailMessage);
}

AWS.config.update({});

const queueURL = '';

const app = Consumer.create({
  queueUrl: queueURL,
  handleMessage: async message => {
    sendMail(message);
  },
  sqs: new AWS.SQS(),
  batchSize: 10,
});

app.on('error', err => {
  console.error(err.message);
});

app.on('processing_error', err => {
  console.error(err.message);
});

console.log('Emails service is running');
app.start();
