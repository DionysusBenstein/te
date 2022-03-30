SELECT * FROM pg_extension;
CREATE EXTENSION "uuid-ossp";

INSERT INTO "balance_history" (
    "id",
    "user_id",
    "balance",
    "change",
    "asset",
    "business",
    "detail",
    "time"
)
VALUES 
    (uuid_generate_v4(), 1, 10, 10, 'BTC', 'deposit', '', '2018-1-01 13:21'),
    (uuid_generate_v4(), 2, 10, 10, 'ETH', 'withdraw', '', '2018-1-01 13:21'),
    (uuid_generate_v4(), 2, 10, 10, 'BTC', 'withdraw', '', '2019-1-05 12:26'),
    (uuid_generate_v4(), 1, 10, 10, 'XRP', 'deposit', '', '2019-1-01 13:21'),
    (uuid_generate_v4(), 1, 10, 10, 'LTC', 'deposit', '', '2020-1-01 13:21'),
    (uuid_generate_v4(), 2, 10, 10, 'XRP', 'withdraw', '', '2020-1-01 15:21'),
    (uuid_generate_v4(), 2, 10, 10, 'LTC', 'deposit', '', '2021-1-01 13:21'),
    (uuid_generate_v4(), 1, 10, 10, 'ETH', 'withdraw', '', '2021-1-01 13:21'),
    (uuid_generate_v4(), 1, 10, 10, 'BTC', 'deposit', '', '2022-1-01 13:21'),
    (uuid_generate_v4(), 2, 10, 10, 'ETH', 'withdraw', '', '2022-1-04 12:21');


INSERT INTO "order_history" (
    "id",
    "user_id",
    "type",
    "side",
    "price",
    "amount",
    "market",
    "deal_money",
    "deal_stock",
    "taker_fee",
    "maker_fee",
    "deal_fee",
    "create_time",
    "finish_time"
)
VALUES 
    (uuid_generate_v4(), 1, 'market', 'bid', 10, 10, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 04:56'),
    (uuid_generate_v4(), 2, 'limit', 'ask', 10, 10, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 05:56'),
    (uuid_generate_v4(), 2, 'market', 'ask', 15, 15, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 02:56'),
    (uuid_generate_v4(), 1, 'limit', 'bid', 10, 10, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 01:56');
