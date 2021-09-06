import 'source-map-support/register';

// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as productsList from '../../../productsList.json';

// import schema from './schema';

const getProductsList = async (event: any) => {
  console.log("getProductsList handler event", event, productsList);
  return formatJSONResponse({
    productsList,
  });
}

export const main = middyfy(getProductsList);
