# Description
Globiance Trading Engine is a trading backend with high-speed performance,  for cryptocurrency exchanges. It can support up to about 100000 trades every second and real-time user/market data notification through websocket.
Typical exchanges use relational database for their trade matching machine. The advantage is that it can rapidly realize business logic and guarantee data accuracy and reliability using data-dependent index, transaction etc. mechanisms. But it would also invite problems to the database and result in poor performance. With the development of quantitative trading, an increasing number of orders are now processed systematically and most of them are high-frequency trading with large order quantity which requires high standard for transaction interface delay. In order to break through the bottlenecks of database performance, we have chosen single process to avoid spending on database transactions and locks, and memory calculation to avoid spending on data persistence in return of significant performance improvement.

# Modules
- Router: Supports a simple HTTP interface and hides complexity for upper layer.
- WebSocket: A websocket server that supports query and pushes for user and market data.
- Engine: for it records user balance and executes user order. It is in memory database, saves operation log in PostgreSQL and redoes the operation log when start. It also     writes user history into PostgreSQL, push balance, orders and deals message to kafka.
- MarketPrice: Reads message(s) from kafka, and generates data.
- History: Reads history data from PostgreSQL.

# Bases
- PostgerSQL: For saving operation log, user balance history, order history and trade history.
- Redis: is for saving market data.
- Kafka: A message system.

# Terminology
The terms to be used during the tables description without further explanations.
* `Exchange` - (usually "the Exchange") the set of the software providing assets exchange functionality and
use the databases to perstist the interanal state.
* `Asset` - in the scope of the Exchange the asset means nothing more than a name of the crypto currency.
* `Money` - an asset an user usually "owns" (or borrow) and may "sell" (or put "ask" limit order) in exchange of the
another asset called "stock".
* `Stock` - in the simplest case, an asset to be suggested by the market for the exchange to "money". Stock
is the currency an user may "buy" (or put "bid" limit order) in exchange of the "money" he owns.
* `Market` - a 6 or 7 characters long string concatenation of "Stock" and "Money".
* `TBI` - "to be investigated" - there's no knowledge yet
* `TBC` - "to be confirmed" - there's an assumtion not confirmed yet
* `user_id` - an ID of exchange user sometimes referred as "exchange id" meaning "an id of the exchange user".