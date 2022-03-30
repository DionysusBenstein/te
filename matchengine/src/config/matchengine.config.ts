/*
  `precSave` precision saved in database
  `precShow` precision used for display
  `prec` in market object is the precision for the market

  for example:
  1.31 - 2 precisions
  3.1231 - 4 precisions
*/

export default {
  assets: [
    {
      name: 'ETH',
      precSave: 16,
      precShow: 8,
    },
    {
      name: 'BTC',
      precSave: 16,
      precShow: 8,
    },
    {
      name: 'BCH',
      precSave: 16,
      precShow: 8,
    },
    {
      name: 'LTC',
      precSave: 16,
      precShow: 8,
    },
    {
      name: 'DASH',
      precSave: 16,
      precShow: 8,
    },
  ],

  markets: [
    {
      name: 'BTCETH',
      stock: {
        name: 'ETH',
        prec: 8,
      },
      money: {
        name: 'BTC',
        prec: 8,
      },
      minAmount: '0.00001',
    },
    {
      name: 'BTCBCH',
      stock: {
        name: 'BCH',
        prec: 8,
      },
      money: {
        name: 'BTC',
        prec: 8,
      },
      minAmount: '0.00001',
    },
    {
      name: 'BTCLTC',
      stock: {
        name: 'LTC',
        prec: 8,
      },
      money: {
        name: 'BTC',
        prec: 8,
      },
      minAmount: '0.00001',
    },
    {
      name: 'BTCDASH',
      stock: {
        name: 'DASH',
        prec: 8,
      },
      money: {
        name: 'BTC',
        prec: 8,
      },
      minAmount: '0.00001',
    },
    {
      name: 'ETHLTC',
      stock: {
        name: 'LTC',
        prec: 8,
      },
      money: {
        name: 'ETH',
        prec: 8,
      },
      minAmount: '0.00001',
    },
  ],
};
