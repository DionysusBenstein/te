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