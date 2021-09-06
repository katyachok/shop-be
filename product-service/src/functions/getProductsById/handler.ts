import 'source-map-support/register';

// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as productsList from '../../../productsList.json';

// import schema from './schema';

const transformStrings = str => {
  if (!str) return;
  return str.toLowerCase().replace(/\s/g, '');
}

const getProductsById = async (event: any) => {
  try {
    let productById;
    if(!event.pathParameters?.productId) return formatJSONResponse({
      message: 'Something went wrong',
    });
    for (let key in productsList) {
      if (transformStrings(productsList[key]?.title) === transformStrings(event.pathParameters?.productId)) {
        productById = { ...productsList[key] };
      }
    };
    console.log("getProductsById handler event", event.pathParameters?.productId, productById );
    return formatJSONResponse({
      ...productById
    });
  } catch (err) {
    console.error(err)
  }
}

export const main = middyfy(getProductsById);
