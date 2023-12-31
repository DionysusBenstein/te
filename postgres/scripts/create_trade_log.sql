-- -- CREATE DATABASE trade_log;

-- CREATE TABLE slice_balance (
--     "id"            SERIAL NOT NULL PRIMARY KEY,
--     "user_id"       INT NOT NULL,
--     "asset"         VARCHAR(4) NOT NULL,
--     "type"          SMALLINT NOT NULL,
--     "balance"       DECIMAL(30,16) NOT NULL
-- );

-- CREATE TABLE slice_order (
--     "id"            SERIAL NOT NULL PRIMARY KEY,
--     "side"          SMALLINT NOT NULL,
--     "create_time"   TIMESTAMP NOT NULL,
--     "update_time"   TIMESTAMP NOT NULL,
--     "user_id"       INT NOT NULL,
--     "market"        VARCHAR(7) NOT NULL,
--     "price"         DECIMAL(30,8) NOT NULL,
--     "amount"        DECIMAL(30,8) NOT NULL,
--     "taker_fee"     DECIMAL(30,4) NOT NULL,
--     "maker_fee"     DECIMAL(30,4) NOT NULL,
--     "left"          DECIMAL(30,8) NOT NULL,
--     "freeze"        DECIMAL(30,8) NOT NULL,
--     "deal_stock"    DECIMAL(30,8) NOT NULL,
--     "deal_money"    DECIMAL(30,16) NOT NULL,
--     "deal_fee"      DECIMAL(30,12) NOT NULL
-- );

-- CREATE TABLE slice_history (
--     "id"            SERIAL NOT NULL PRIMARY KEY,
--     "time"          TIMESTAMP NOT NULL,
--     "end_oper_id"   INT NOT NULL,
--     "end_order_id"  INT NOT NULL,
--     "end_deals_id"  INT NOT NULL
-- );

-- CREATE TABLE operlog (
--     "id"            SERIAL NOT NULL PRIMARY KEY,
--     "time"          TIMESTAMP NOT NULL,
--     "detail"        TEXT
-- );
