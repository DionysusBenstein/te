-- balance_history
INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (1, '2018-1-01 13:21', 1, 'BTC', 'A', 5, 155, 'AAA');

INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (2, '2018-1-01 13:21', 2, 'ETH', 'A', 5, 5, 'BBB');

INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (3, '2019-1-01 13:21', 2, 'BTC', 'A', 5, 155, 'AAA');

INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (4, '2019-1-01 13:21', 1, 'ETH', 'A', 5, 155, 'AAA');

INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (5, '2020-1-01 13:21', 1, 'BTC', 'A', 5, 155, 'AAA');

INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (6, '2020-1-01 13:21', 2, 'ETH', 'A', 5, 155, 'AAA');

INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (7, '2021-1-01 13:21', 2, 'BTC', 'A', 5, 155, 'AAA');

INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (8, '2021-1-01 13:21', 1, 'ETH', 'A', 5, 155, 'AAA');

INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (9, '2022-1-01 13:21', 1, 'BTC', 'A', 5, 155, 'AAA');

INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (10, '2022-1-01 13:21', 2, 'ETH', 'A', 5, 155, 'AAA');



-- order_history
INSERT INTO "order_history" ("id", "create_time", "finish_time", "user_id", "market", "source", "t", "side", "price", "amount", "taker_fee", "maker_fee", "deal_stock", "deal_money", "deal_fee")
VALUES (1, '2022-2-28 04:42', '2022-2-28 04:56', 1, 'ETHBTC', 'AAA', 5, 5, 20, 15, 1, 1, 2, 2, 6);

INSERT INTO "order_history" ("id", "create_time", "finish_time", "user_id", "market", "source", "t", "side", "price", "amount", "taker_fee", "maker_fee", "deal_stock", "deal_money", "deal_fee")
VALUES (2, '2022-2-28 06:25', '2022-2-28 07:31', 2, 'XRPBTC', 'AAA', 5, 5, 20, 15, 1, 1, 2, 2, 6);


INSERT INTO "deal_history" ("id", "time", "user_id", "deal_id", "order_id", "deal_order_id", "role", "price", "amount", "deal", "fee", "deal_fee") 
VALUES (1, '2022-2-28 06:25', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

INSERT INTO "order_detail" ("id", "create_time", "finish_time", "user_id", "market", "source", "t", "side", "price", "amount", "taker_fee", "maker_fee", "deal_stock", "deal_money", "deal_fee")
VALUES (1, '2018-2-28 06:25', '2022-2-28 07:31', 2, 'XRPBTC', 'AAA', 5, 5, 20, 15, 1, 1, 2, 2, 6);

INSERT INTO "user_deal_history" (
    "id",
    "time",
    "user_id",
    "market",
    "deal_id",
    "order_id",
    "deal_order_id",
    "side",
    "role",
    "price",
    "amount",
    "deal",
    "fee",
    "deal_fee"
)
VALUES (1, '2018-2-28 06:25', 2, 'XRPBTC', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
