import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  useDotenv: true,
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {
        Ref: "SQSQueue"
      },
      SNS_ARN: {
        Ref: "SNSTopic"
      }
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: "s3:ListBucket",
        Resource: "arn:aws:s3:::${env:UPLOADBUCKET}",
      },
      {
        Effect: 'Allow',
        Action: "s3:*",
        Resource: "arn:aws:s3:::${env:UPLOADBUCKET}/*",
      },
      {
        Effect: 'Allow',
        Action: "sqs:*",
        Resource: {
					"Fn::GetAtt": [
						"SQSQueue",
						"Arn"
					]
				}
      },
      {
        Effect: 'Allow',
        Action: "sns:*",
        Resource: {
					"Ref": "SNSTopic",
				}
      },
    ],
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "catalogItemsTopic",
        },
      },
      SNSSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "kateTestWo@outlook.com",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic"
          }
        },
      }
    }
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser, catalogBatchProcess },
};

module.exports = serverlessConfiguration;
