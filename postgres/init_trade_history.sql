-- balance_history
INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (1, '2022-2-28 13:21', 1, 'BTC', 'A', 5, 155, 'AAA');

INSERT INTO "balance_history" ("id", "time", "user_id", "asset", "business", "change", "balance", "detail")
VALUES (2, '2022-2-28 13:21', 2, 'ETH', 'A', 5, 5, 'BBB');

-- order_history
INSERT INTO "order_history" ("id", "create_time", "finish_time", "user_id", "market", "source", "t", "side", "price", "amount", "taker_fee", "maker_fee", "deal_stock", "deal_money", "deal_fee")
VALUES (1, '2022-2-28 04:42', '2022-2-28 04:56', 1, 'ETHBTC', 'AAA', 5, 5, 20, 15, 1, 1, 2, 2, 6);

INSERT INTO "order_history" ("id", "create_time", "finish_time", "user_id", "market", "source", "t", "side", "price", "amount", "taker_fee", "maker_fee", "deal_stock", "deal_money", "deal_fee")
VALUES (2, '2022-2-28 06:25', '2022-2-28 07:31', 2, 'XRPBTC', 'AAA', 5, 5, 20, 15, 1, 1, 2, 2, 6);
