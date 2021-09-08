import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';
import { dbOptions } from '@functions/utils.js';
import { v4 as uuidv4 } from 'uuid';

const getProductsList = async (event: any) => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    switch (event.httpMethod) {
      case 'GET': {
        const ddlResult = await client.query(`SELECT * FROM products RIGHT JOIN stocks ON stocks.product_id = products.id`);
        console.log('ddlResult in getProductsList', ddlResult);
        const { rows } = ddlResult;
        return formatJSONResponse({
          rows,
        });
      }
      case 'POST': {
        console.log('post request', event.body);
        const id = uuidv4();
        const { title, description, price, count } = event.body;
        console.log('post request event body', title, description, price, count, id);

        await client.query(`insert into products (id, title, description, price) values ('${id}', '${title}', '${description}', '${price}')`);
        await client.query(`insert into stocks (product_id, count) values ('${id}', '${count}')`);

        return formatJSONResponse({});
      }
    }
  } catch (err) {
    console.error('Error during db request:', err);
  } finally {
    client.end()
  }
}

export const main = middyfy(getProductsList);
