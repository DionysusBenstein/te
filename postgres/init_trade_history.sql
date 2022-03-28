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
    (1, 1, 10, 10, 'BTC', 'deposit', '', '2018-1-01 13:21'),
    (2, 2, 10, 10, 'ETH', 'withdraw', '', '2018-1-01 13:21'),
    (3, 2, 10, 10, 'BTC', 'withdraw', '', '2019-1-05 12:26'),
    (4, 1, 10, 10, 'XRP', 'deposit', '', '2019-1-01 13:21'),
    (5, 1, 10, 10, 'LTC', 'deposit', '', '2020-1-01 13:21'),
    (6, 2, 10, 10, 'XRP', 'withdraw', '', '2020-1-01 15:21'),
    (7, 2, 10, 10, 'LTC', 'deposit', '', '2021-1-01 13:21'),
    (8, 1, 10, 10, 'ETH', 'withdraw', '', '2021-1-01 13:21'),
    (9, 1, 10, 10, 'BTC', 'deposit', '', '2022-1-01 13:21'),
    (10, 2, 10, 10, 'ETH', 'withdraw', '', '2022-1-04 12:21');


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
    (1, 1, 'market', 'bid', 10, 10, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 04:56'),
    (2, 2, 'limit', 'ask', 10, 10, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 05:56'),
    (3, 2, 'market', 'ask', 15, 15, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 02:56'),
    (4, 1, 'limit', 'bid', 10, 10, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 01:56');
