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
    (uuid_generate_v4(), '5b6f444b-340d-402e-92ea-c466fd29a99e', 1000, 1000, 'ETH', 'deposit', '', '2018-1-01 13:21'),
    (uuid_generate_v4(), '5b6f444b-340d-402e-92ea-c466fd29a99e', 1000, 1000, 'XRP', 'deposit', '', '2019-1-01 13:21'),
    (uuid_generate_v4(), '5b6f444b-340d-402e-92ea-c466fd29a99e', 1000, 1000, 'LTC', 'deposit', '', '2020-1-01 13:21'),
    (uuid_generate_v4(), '5b6f444b-340d-402e-92ea-c466fd29a99e', 1000, 1000, 'BTC', 'deposit', '', '2022-1-01 13:21')

-- INSERT INTO "order_history" (
--     "id",
--     "user_id",
--     "type",
--     "side",
--     "price",
--     "amount",
--     "market",
--     "deal_money",
--     "deal_stock",
--     "taker_fee",
--     "maker_fee",
--     "deal_fee",
--     "create_time",
--     "finish_time"
-- )
-- VALUES 
--     (uuid_generate_v4(), '5b6f444b-340d-402e-92ea-c466fd29a99e', 'market', 'bid', 10, 10, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 04:56'),
--     (uuid_generate_v4(), 'd8c6ff4d-5d99-4f38-96df-616bc574aed3', 'limit', 'ask', 10, 10, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 05:56'),
--     (uuid_generate_v4(), 'd8c6ff4d-5d99-4f38-96df-616bc574aed3', 'market', 'ask', 15, 15, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 02:56'),
--     (uuid_generate_v4(), '5b6f444b-340d-402e-92ea-c466fd29a99e', 'limit', 'bid', 10, 10, 'ETHBTC', 9, 9, 1, 1, 2, '2022-2-28 04:42', '2022-2-28 01:56');
