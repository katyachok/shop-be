import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';
import { dbOptions } from '@functions/utils.js';

const getProductsById = async (event: any) => {
    const client = new Client(dbOptions);
    await client.connect();
  try {
    const ddlResult = await client.query(`SELECT * FROM products, stocks WHERE products.id = '${event.pathParameters?.productId}' and stocks.product_id = '${event.pathParameters?.productId}'`);
    console.log('ddlResult in productId request', ddlResult, event.pathParameters?.productId);
    const res = ddlResult.rows[0];
    return formatJSONResponse({
      res,
    });
  } catch (err) {
    console.error(err)
  } finally {
    client.end()
  }
}

export const main = middyfy(getProductsById);
