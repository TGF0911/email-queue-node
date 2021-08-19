import express, { Request, Response } from 'express';
import * as AWS from 'aws-sdk';

const app = express();

app.use(express.json());

AWS.config.update({});

const sqs = new AWS.SQS();
const queueURL = '';

app.post('/user', async (req: Request, res: Response) => {
  const { userEmail, itemName, itemPrice, itemQuantity } = req.body;

  await sqs
    .sendMessage({
      QueueUrl: queueURL,
      MessageBody: JSON.stringify({
        userEmail,
        itemName,
        itemPrice,
        itemQuantity,
      }),
    })
    .promise();
});

app.listen(3333, () => console.log('Server is running -> port 3333'));
