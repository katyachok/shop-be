import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
const AWS = require('aws-sdk');
import { getProductsList } from '@functions/getProductsList/handler';

const catalogBatchProcess = async (event) => {
  console.log('catalogBatchProcess event', event);
  const sns = new AWS.SNS({ region: 'eu-west-1' })

  for (const record of event.Records) {
    const product = await getProductsList({ body: JSON.parse(record.body), httpMethod: 'POST'});
    sns.publish({
    Subject: 'product info',
    Message: JSON.stringify(product),
    TopicArn: process.env.SNS_ARN
  }, () => {
    console.log('Send email for' + JSON.stringify(product))
  })
  }
}

export const main = middyfy(catalogBatchProcess);
