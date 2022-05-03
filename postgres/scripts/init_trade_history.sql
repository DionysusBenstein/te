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
