import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  useDotenv: true,
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] }
        },
        {
            Effect: 'Allow',
            Action: 'sns:*',
            Resource: {
				"Ref": "SNSTopic",
			}
        }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: '${env:PG_HOST}',
      PG_PORT: '${env:PG_PORT}',
      PG_DATABASE: '${env:PG_DATABASE}',
      PG_USERNAME: '${env:PG_USERNAME}',
      PG_PASSWORD: '${env:PG_PASSWORD}',
      SNS_ARN: {
        Ref: "SNSTopic"
      }
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue2",
        },
      },
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "catalogItemsTopic2",
        },
      },
      SNSSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: 'kateTestWo@outlook.com',
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic"
          }
        },
      }
    },
    Outputs: {
      QueueURL: {
        Value: {
          Ref: 'SQSQueue',
        }
      },
      QueueARN: {
        Value: {
          'Fn::GetAtt': [
            'SQSQueue',
            'Arn'
          ]
        }
      }
    }
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, catalogBatchProcess },
};

module.exports = serverlessConfiguration;