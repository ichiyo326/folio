CREATE TABLE IF NOT EXISTS product (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100),
    stock INT,
    version BIGINT
);

CREATE TABLE IF NOT EXISTS orders (
    order_id BIGINT PRIMARY KEY,
    user_id BIGINT,
    order_date DATETIME
);

CREATE TABLE IF NOT EXISTS order_item (
    order_item_id BIGINT PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    quantity INT
);
