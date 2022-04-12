const { Client } = require('jayson');
const axios = require('axios');

const client = Client.http({
  host: 'localhost',
  port: 3001,
});

const seconds = 60;
const samplePeriod = 10000;
const targetBookSize = 500;

const t = new Date();
const start = new Date();
t.setSeconds(t.getSeconds() + seconds);

for (var i = 1e6, lookupTable = []; i--; ) {
  lookupTable.push(Math.random());
}

function lookupRand() {
  return ++i >= lookupTable.length ? lookupTable[(i = 0)] : lookupTable[i];
}

// const order = {
//   user_id: '5b6f444b-340d-402e-92ea-c466fd29a99e',
//   side: 'ask',
//   market: 'BTCETH',
//   price: 100,
//   amount: 10,
//   taker_fee: 0,
//   maker_fee: 0,
// };

function placeLimit() {
  const order = {
    user_id: '5b6f444b-340d-402e-92ea-c466fd29a99e',
    side: 'ask',
    market: 'BTCETH',
    price: lookupRand() * 100,
    amount: Math.floor(lookupRand() * 100),
    taker_fee: 0,
    maker_fee: 0,
  };

  axios
    .post('http://localhost:3001', {
      id: 1,
      jsonrpc: '2.0',
      method: 'order.put_limit',
      params: order,
    })
    .then((res) => console.log(res.data));
}

const run = async (_) => {
  console.log('Start');
  for (let index = 0; Date.now() < t; index++) {
    for (let i = 0; i < 10; i++) {
      placeLimit();
    }

    const order = {
      user_id: '5b6f444b-340d-402e-92ea-c466fd29a99e',
      side: 'bid',
      market: 'BTCETH',
      // price: lookupRand() * 100,
      amount: Math.floor(lookupRand() * 100),
      taker_fee: 0,
      maker_fee: 0,
    };

    const res = await axios.post('http://localhost:3001', {
      id: 1,
      jsonrpc: '2.0',
      method: 'order.put_market',
      params: order,
    });

    const seconds = (Date.now() - start) / 1000;

    console.log(res.data);

    console.log('');
    console.log('---------------------');
    console.log('');
    console.log('Seconds ' + seconds);
    console.log('');
    console.log('---------------------');
    console.log('');
  }

  console.log('End');
  console.log('');
  console.log(
    'Trades:',
    (
      await axios.post('http://localhost:3001', {
        id: 1,
        jsonrpc: '2.0',
        method: 'order.settle_book',
        params: {},
      })
    ).data
  );
};

run();
