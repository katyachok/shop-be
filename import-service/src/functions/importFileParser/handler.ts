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
    const bucket = record.s3.bucket.name;
    const filePath = record.s3.object.key;
    const s3Stream = s3.getObject({
      Bucket: bucket,
      Key: filePath
    }).createReadStream();
    
    s3Stream.pipe(csv())
      .on('data', data => {
        console.log(data);
      })
      .on('end', async () => {
        await s3.copyObject({
          Bucket: bucket,
          CopySource: `${bucket}/${filePath}`,
          Key: filePath.replace('uploaded', 'parsed'),
        }).promise();
        console.log(`copied ${filePath}`);

        await s3.deleteObject({
          Bucket: bucket,
          Key: filePath,
        }).promise();
        console.log(`deleted ${filePath}`);
      })
  });

  return formatJSONResponse({
    code: 200
  })
}

export const main = middyfy(importFileParser);
