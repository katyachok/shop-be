import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
const AWS = require('aws-sdk');

const catalogBatchProcess = async (event) => {
  console.log('catalogBatchProcess event', event);
  const products = event.Records.map(({ body }) => body);
  console.log('catalogBatchProcess products', products);
  const sns = new AWS.SNS({ region: 'eu-west-1' })
  
  sns.publish({
    Subject: 'product info',
    Message: JSON.stringify(products),
    TopicArn: process.env.SNS_ARN
  }, () => {
    console.log('Send email for' + JSON.stringify(products))
  })


  return formatJSONResponse({
    code: 200
  })
}

export const main = middyfy(catalogBatchProcess);
