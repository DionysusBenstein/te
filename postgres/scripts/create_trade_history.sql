CREATE TABLE order_history (
    "id"             uuid NOT NULL PRIMARY KEY,
    "exchange_id"    uuid NOT NULL,
    "exchange_name"  VARCHAR(40) NOT NULL,
    "user_id"        uuid NOT NULL,

    "type"           VARCHAR(6) NOT NULL,
    "side"           VARCHAR(4) NOT NULL,
    "market"         VARCHAR(8) NOT NULL,
    "stock"          VARCHAR(4),
    "money"          VARCHAR(4),
    "status"         VARCHAR(20) NOT NULL,
    "price"          DECIMAL(38,12) NOT NULL,
    "amount"         DECIMAL(38,12) NOT NULL,
    "filled_qty"     DECIMAL(38,12),
    "total"          DECIMAL(38,12) NOT NULL,
    "executed_total" DECIMAL(38,12),

    "total_fee"      DECIMAL(38,12) NOT NULL,
    "deal_money"     DECIMAL(38,12) NOT NULL,
    "deal_stock"     DECIMAL(38,12) NOT NULL,

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
    "market"         VARCHAR(8) NOT NULL,
    "role"           VARCHAR(5) NOT NULL,
    "price"          DECIMAL(38,12) NOT NULL,
    "amount"         DECIMAL(38,12) NOT NULL,
    "total"          DECIMAL(38,12) NOT NULL,
    "deal"           DECIMAL(38,12) NOT NULL,
    "fee"            DECIMAL(38,12) NOT NULL,
    "deal_fee"       DECIMAL(38,12) NOT NULL,
    "time"           TIMESTAMP NOT NULL
);

CREATE TABLE balance_history (
    "id"             uuid NOT NULL PRIMARY KEY,
    "user_id"        uuid NOT NULL,
    "balance"        DECIMAL(38,16) NOT NULL,
    "change"         DECIMAL(38,12) NOT NULL,
    "asset"          VARCHAR(4) NOT NULL,
    "business"       VARCHAR(9) NOT NULL,
    "detail"         TEXT NOT NULL,
    "time"           TIMESTAMP NOT NULL
);

CREATE TABLE webhook_history (
    "deal_id"        uuid NOT NULL,
    "api_error"      TEXT,
    "error"          TEXT,
    "time"           TIMESTAMP NOT NULL,
    CONSTRAINT "webhook_pk" PRIMARY KEY ("deal_id", "time")
)