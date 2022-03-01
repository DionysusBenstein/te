-- CREATE DATABASE trade_history;

CREATE TABLE user_deal_history (
    "id"             SERIAL NOT NULL PRIMARY KEY,
    "time"           TIMESTAMP NOT NULL,
    "user_id"        INT NOT NULL,
    "market"         VARCHAR(30) NOT NULL,
    "deal_id"        SERIAL NOT NULL,
    "order_id"       SERIAL NOT NULL,
    "deal_order_id"  SERIAL NOT NULL,
    "side"           SMALLINT NOT NULL,
    "role"           SMALLINT NOT NULL,
    "price"          DECIMAL(30,8) NOT NULL,
    "amount"         DECIMAL(30,8) NOT NULL,
    "deal"           DECIMAL(30,16) NOT NULL,
    "fee"            DECIMAL(30,16) NOT NULL,
    "deal_fee"       DECIMAL(30,16) NOT NULL
);

CREATE TABLE deal_history (
    "id"             SERIAL NOT NULL PRIMARY KEY,
    "time"           TIMESTAMP NOT NULL,
    "user_id"        INT NOT NULL,
    "deal_id"        SERIAL NOT NULL,
    "order_id"       SERIAL NOT NULL,
    "deal_order_id"  SERIAL NOT NULL,
    "role"           SMALLINT NOT NULL,
    "price"          DECIMAL(30,8) NOT NULL,
    "amount"         DECIMAL(30,8) NOT NULL,
    "deal"           DECIMAL(30,16) NOT NULL,
    "fee"            DECIMAL(30,16) NOT NULL,
    "deal_fee"       DECIMAL(30,16) NOT NULL
);

CREATE TABLE order_detail (
    "id"             SERIAL NOT NULL PRIMARY KEY,
    "create_time"    TIMESTAMP NOT NULL,
    "finish_time"    TIMESTAMP NOT NULL,
    "user_id"        SERIAL NOT NULL,
    "market"         VARCHAR(7) NOT NULL,
    "source"         VARCHAR(30) NOT NULL,
    "t"              SMALLINT NOT NULL,
    "side"           SMALLINT NOT NULL,
    "price"          DECIMAL(30,8) NOT NULL,
    "amount"         DECIMAL(30,8) NOT NULL,
    "taker_fee"      DECIMAL(30,4) NOT NULL,
    "maker_fee"      DECIMAL(30,4) NOT NULL,
    "deal_stock"     DECIMAL(30,8) NOT NULL,
    "deal_money"     DECIMAL(30,16) NOT NULL,
    "deal_fee"       DECIMAL(30,16) NOT NULL
);

CREATE TABLE order_history (
    "id"             SERIAL NOT NULL PRIMARY KEY,
    "create_time"    TIMESTAMP NOT NULL,
    "finish_time"    TIMESTAMP NOT NULL,
    "user_id"        SERIAL NOT NULL,
    "market"         VARCHAR(30) NOT NULL,
    "source"         VARCHAR(30) NOT NULL,
    "t"              SMALLINT NOT NULL,
    "side"           SMALLINT NOT NULL,
    "price"          DECIMAL(30,8) NOT NULL,
    "amount"         DECIMAL(30,8) NOT NULL,
    "taker_fee"      DECIMAL(30,4) NOT NULL,
    "maker_fee"      DECIMAL(30,4) NOT NULL,
    "deal_stock"     DECIMAL(30,8) NOT NULL,
    "deal_money"     DECIMAL(30,16) NOT NULL,
    "deal_fee"       DECIMAL(30,16) NOT NULL
);

CREATE TABLE balance_history (
    "id"             SERIAL NOT NULL PRIMARY KEY,
    "time"           TIME NOT NULL,
    "user_id"        SERIAL NOT NULL,
    "asset"          VARCHAR(4) NOT NULL,
    "business"       VARCHAR(30) NOT NULL,
    "business_id"    SERIAL NOT NULL,
    "change"         DECIMAL(30,8) NOT NULL,
    "balance"        DECIMAL(30,16) NOT NULL,
    "detail"         TEXT NOT NULL
);
