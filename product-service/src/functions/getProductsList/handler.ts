import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';
import { dbOptions } from '@functions/utils.js';

const getProductsList = async (event: any) => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const ddlResult = await client.query(`SELECT * FROM products RIGHT JOIN stocks ON stocks.product_id = products.id`);
    console.log('ddlResult in getProductsList', ddlResult);
    const { rows } = ddlResult;
    return formatJSONResponse({
      rows,
    });
  } catch (err) {
    console.error('Error during db request:', err);
  } finally {
    client.end()
  }
}

export const main = middyfy(getProductsList);
