import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { errorHandler } from '@libs/errorHandler';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';
import { dbOptions } from '@functions/utils.js';

const getProductsById = async (event: any) => {
  const client = new Client(dbOptions);
  await client.connect();
  
  try {
    console.log('productId request', event.pathParameters?.productId);
    const ddlResult = await client.query(`SELECT * FROM products, stocks WHERE products.id = '${event.pathParameters?.productId}' and stocks.product_id = '${event.pathParameters?.productId}'`);
    const res = ddlResult.rows[0];
    return formatJSONResponse({
      res,
    });
  } catch (err) {
    console.error(err);
        return errorHandler(500);
  } finally {
    client.end()
  }
}

export const main = middyfy(getProductsById);
