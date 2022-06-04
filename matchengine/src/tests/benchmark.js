const { Client } = require('jayson');
const axios = require('axios');

// const client = Client.http({
//   host: 'https://uatv3api.globiance.com/trading-engine',
// });

const seconds = 60;
const targetBookSize = 10000;

const t = new Date();
const start = new Date();
t.setSeconds(t.getSeconds() + seconds);


function placeLimit() {
  const order = {
    "user_id": "79A79A10-A7F7-4649-A01C-5F84D802450F",
    "exchange_id": "08c4a640-3d77-11eb-a3e9-01b6e5789197",
    "exchange_name": "globiance",
    "side": "sell",
    "market": "BTCEUR",
    "stock": "BTC",
    "money": "EUR",
    "price": Math.random() * (1000 - 10),
    "amount": Math.random() * (1000 - 10),
    "total_fee": 0
}

  axios
    .post('https://uatv3api.globiance.com/trading-engine', {
      id: 1,
      jsonrpc: '2.0',
      method: 'order.put_limit',
      params: order,
    })
    .then((res) => {return 1});
}

const run = async (_) => {
  console.log('Start');
  for (let index = 0; index < targetBookSize; index++) {
    for (let i = 0; i < 10; i++) {
      placeLimit();
    }

    const order = {
        "user_id": "79A79A10-A7F7-4649-A01C-5F84D802450F",
        "exchange_id": "08c4a640-3d77-11eb-a3e9-01b6e5789197",
        "exchange_name": "globiance",
        "side": "buy",
        "market": "BTCEUR",
        "stock": "BTC",
        "money": "EUR",
        "amount": Math.random() * (1000 - 10),
        "total_fee": 0
    };

    const res = await axios.post('https://uatv3api.globiance.com/trading-engine', {
      id: 1,
      jsonrpc: '2.0',
      method: 'order.put_market',
      params: order,
    });
  }
  const seconds = (Date.now() - start) / 1000;


  console.log('');
  console.log('---------------------');
  console.log('');
  console.log('Seconds ' + seconds);
  console.log('');
  console.log('---------------------');
  console.log('');
  // console.log('End');
  console.log('---------------------');
  console.log("Books " + targetBookSize)
  console.log("")
  console.log("Transactions/Seconds: " + Math.floor(targetBookSize/seconds*1000)/1000  )
  console.log("")

};

run();
