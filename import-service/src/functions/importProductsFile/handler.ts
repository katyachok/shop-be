import 'source-map-support/register';
// import entire SDK
// import AWS from 'aws-sdk';
const AWS = require('aws-sdk')
// import { config,  S3 , CognitoIdentityCredentials} from 'aws-sdk';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';


const importProductsFile = async (event) => {
  console.log('importProductsFile handler', event.queryStringParameters, event.pathParameters);
  const fileName = event.queryStringParameters.name;
  console.log('importProductsFile fileName', fileName);

  const signedUrl = `uploaded/${fileName}`;

  const s3 = new AWS.S3({ region: 'eu-west-1' });

  const s3Params = {
    Bucket: process.env.UPLOADBUCKET,
    Key: signedUrl,
    Expires: 60,
    ContentType: 'text/csv'
  }

  const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
  console.log('importProductsFile uploadURL', uploadURL);

  return formatJSONResponse(uploadURL)
}

export const main = middyfy(importProductsFile);
