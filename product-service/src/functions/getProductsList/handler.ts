import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { errorHandler } from '@libs/errorHandler';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';
import { dbOptions } from '@functions/utils.js';
import { v4 as uuidv4 } from 'uuid';

export const getProductsList = async (event: any) => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    switch (event.httpMethod) {
      case 'GET': {
        console.log('getProducts', event);
        const ddlResult = await client.query(`SELECT id, title, description, price, count FROM products RIGHT JOIN stocks ON stocks.product_id = products.id`);
        const { rows } = ddlResult;
        return formatJSONResponse({
          ...rows,
        });
      }
      case 'POST': {
        console.log('post create product request', event.body);
        const id = uuidv4();
        const { title, description, price, count } = event.body;
        console.log('post request event body', title, description, price, count, id);

        if (!title || !price || !count) return errorHandler(400);

        await client.query(`insert into products (id, title, description, price) values ('${id}', '${title}', '${description}', '${price}')`);
        await client.query(`insert into stocks (product_id, count) values ('${id}', '${count}')`);

        return formatJSONResponse({title, description, price, count, id});
      }
    }
  } catch (err) {
    console.error('Error during db request:', err);
    return errorHandler(500);
  } finally {
    client.end()
  }
}

export const main = middyfy(getProductsList);
