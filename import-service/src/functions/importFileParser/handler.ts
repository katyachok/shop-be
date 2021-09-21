import 'source-map-support/register';
// import entire SDK
// import AWS from 'aws-sdk';
const AWS = require('aws-sdk')
const csv = require('csv-parser');
// import { config,  S3 , CognitoIdentityCredentials} from 'aws-sdk';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const importFileParser = async (event) => {
  const s3 = new AWS.S3({ region: 'eu-west-1' });

  console.log('importFileParser event.Records', event.Records);
  event.Records.forEach(record => {
    const s3Stream = s3.getObject({
      Bucket: process.env.UPLOADBUCKET,
      Key: record.s3.object.key
    }).createReadStream();
    
    s3Stream.pipe(csv())
      .on('data', data => {
        console.log(data);
      })
      .on('end', async () => {
        console.log(`end from ${record.s3.object.key}`);
      })
  });

  return formatJSONResponse({
    code: 200
  })
}

export const main = middyfy(importFileParser);
