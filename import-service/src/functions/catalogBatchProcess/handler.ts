import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
const AWS = require('aws-sdk')

const catalogBatchProcess = async (event) => {
  console.log('catalogBatchProcess event', event);

  const sqs = new AWS.SQS();
  const products = JSON.parse(event.body);

  products.forEach(product => {
    sqs.sendMessage({
      QueueUrl: process.env.SQS_URL,
      MessageBody: product
    }, () => {
      console.log('send message for' + product);
    })
  });

  return formatJSONResponse({
    code: 200
  })
}

export const main = middyfy(catalogBatchProcess);
