CREATE TABLE order_history (
    "id"             uuid NOT NULL PRIMARY KEY,
    "user_id"        SERIAL NOT NULL,

    "type"           VARCHAR(6) NOT NULL,
    "side"           VARCHAR(3) NOT NULL,
    "price"          DECIMAL(30,8) NOT NULL,
    "amount"         DECIMAL(30,8) NOT NULL,
    "market"         VARCHAR(7) NOT NULL,

    "taker_fee"       DECIMAL(30,4) NOT NULL,
    "maker_fee"       DECIMAL(30,4) NOT NULL,
    "deal_money"      DECIMAL(30,16) NOT NULL,
    "deal_stock"      DECIMAL(30,8) NOT NULL,
    "deal_fee"        DECIMAL(30,16) NOT NULL,

    "create_time"     TIMESTAMP NOT NULL,
    "finish_time"     TIMESTAMP NOT NULL
);

CREATE TABLE deal_history (
    "id"             uuid NOT NULL PRIMARY KEY,
    "user_id"        SERIAL NOT NULL,
    "deal_id"        uuid NOT NULL,
    "order_id"       uuid NOT NULL,
    "deal_order_id"  uuid NOT NULL,
    "role"           SMALLINT NOT NULL,
    "price"          DECIMAL(30,8) NOT NULL,
    "amount"         DECIMAL(30,8) NOT NULL,
    "deal"           DECIMAL(30,16) NOT NULL,
    "fee"            DECIMAL(30,16) NOT NULL,
    "deal_fee"       DECIMAL(30,16) NOT NULL,
    "time"           TIMESTAMP NOT NULL
);

CREATE TABLE balance_history (
    "id"             uuid NOT NULL PRIMARY KEY,
    "user_id"        SERIAL NOT NULL,
    "balance"        DECIMAL(30,16) NOT NULL,
    "change"         DECIMAL(30,8) NOT NULL,
    "asset"          VARCHAR(4) NOT NULL,
    "business"       VARCHAR(9) NOT NULL,
    "detail"         TEXT NOT NULL,
    "time"           TIMESTAMP NOT NULL
);
