create extension if not exists "uuid-ossp";

create table products (
  	id  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    price integer
)

create table stocks (
  	product_id  uuid,
  	count integer,
  	FOREIGN KEY (product_id) REFERENCES products(id)   
)

insert into products (title, description, price) values
('Cappuccino', 'Dark, rich espresso lies in wait under a smoothed and stretched layer of thick milk foam. An alchemy of barista artistry and craft', 2.4),
('Blonde Roast', 'Lightly roasted coffee that is soft, mellow and flavorful. Easy-drinking on its own and delicious with milk, sugar or flavored with vanilla, caramel or hazelnut', 4.25),
('Espresso Con Panna', 'Espresso meets a dollop of whipped cream to enhance the rich and caramelly flavors of a straight-up shot', 2.95),
('Flat White', 'Smooth ristretto shots of espresso get the perfect amount of steamed whole milk to create a not-too-strong, not-too-creamy, just-right flavor', 3.75),
('Pumpkin Spice Latte', 'Our signature espresso and steamed milk with the celebrated flavor combination of pumpkin, cinnamon, nutmeg and clove. Enjoy it topped with whipped cream and real pumpkin-pie spices', 4.25),
('Apple Crisp Macchiato', 'Layered flavors of apple and brown sugar meld like the filling of a gooey apple pie in harmony with espresso, steamed milk and a caramelized-spiced apple drizzle—a nostalgic autumn pick-me-up', 3.75),
('Caffè Mocha', 'Our rich, full-bodied espresso combined with bittersweet mocha sauce and steamed milk, then topped with sweetened whipped cream. The classic coffee drink that always sweetly satisfies', 3.45),
('Caffè Americano', 'Espresso shots topped with hot water create a light layer of crema culminating in this wonderfully rich cup with depth and nuance. Pro Tip: For an additional boost, ask your barista to try this with an extra shot', 2.45)


insert into stocks (product_id, count) values
('c49fa901-8c4f-49fc-ab77-d754d256f683', 150),
('6113f49e-f06a-4dfd-95ae-be634794e204', 50),
('257a3771-cf28-4321-8f26-e812772f63e8', 150),
('8d03e7c1-4d3b-4e9a-accd-07006405c1cf', 150),
('0d7fec63-ed39-49a2-827b-c09ecd68d5ce', 70),
('ac9e9d0c-8aa7-425c-a2b3-7be1b1d31787', 8),
('200756a0-9352-4ce4-96b4-29f68bb1ad36', 2),
('13d85375-8023-42f2-bbd5-6e77f29965d5', 3)
