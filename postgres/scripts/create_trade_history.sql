CREATE TABLE order_history (
    "id"             uuid NOT NULL PRIMARY KEY,
    "exchange_id"    uuid NOT NULL,
    "exchange_name"  VARCHAR(40) NOT NULL,
    "user_id"        uuid NOT NULL,

    "type"           VARCHAR(6) NOT NULL,
    "side"           VARCHAR(4) NOT NULL,
    "market"         VARCHAR(7) NOT NULL,
    "status"         VARCHAR(9) NOT NULL,
    "price"          DECIMAL(30,8) NOT NULL,
    "amount"         DECIMAL(30,8) NOT NULL,
    "filled_qty"     DECIMAL(30,8),
    "total"          DECIMAL(30,8) NOT NULL,
    "executed_total" DECIMAL(30,8),

    "total_fee"      DECIMAL(30,4) NOT NULL,
    "deal_money"     DECIMAL(30,16) NOT NULL,
    "deal_stock"     DECIMAL(30,8) NOT NULL,

    "create_time"    TIMESTAMP NOT NULL,
    "update_time"    TIMESTAMP NOT NULL
);

CREATE TABLE deal_history (
    "id"             uuid NOT NULL PRIMARY KEY,
    "exchange_id"    uuid NOT NULL,
    "exchange_name"  VARCHAR(40) NOT NULL,
    "user_id"        uuid NOT NULL,
    "deal_user_id"   uuid NOT NULL,
    "order_id"       uuid NOT NULL,
    "deal_order_id"  uuid NOT NULL,
    "market"         VARCHAR(7) NOT NULL,
    "role"           VARCHAR(5) NOT NULL,
    "price"          DECIMAL(30,8) NOT NULL,
    "amount"         DECIMAL(30,8) NOT NULL,
    "total"          DECIMAL(30,8) NOT NULL,
    "deal"           DECIMAL(30,16) NOT NULL,
    "fee"            DECIMAL(30,16) NOT NULL,
    "deal_fee"       DECIMAL(30,16) NOT NULL,
    "time"           TIMESTAMP NOT NULL
);

CREATE TABLE balance_history (
    "id"             uuid NOT NULL PRIMARY KEY,
    "user_id"        uuid NOT NULL,
    "balance"        DECIMAL(30,16) NOT NULL,
    "change"         DECIMAL(30,8) NOT NULL,
    "asset"          VARCHAR(4) NOT NULL,
    "business"       VARCHAR(9) NOT NULL,
    "detail"         TEXT NOT NULL,
    "time"           TIMESTAMP NOT NULL
);
