/*
  `prec` is the precision for the asset
  for example:
  1.31 - 2 precisions
  3.1415 - 4 precisions
*/

export default {
  assets: [
    {
      name: 'EUR',
      prec: 2,
    },
    {
      name: 'BTC',
      prec: 8,
    },
    {
      name: 'ETH',
      prec: 8,
    },
    {
      name: 'XRP',
      prec: 8,
    },
    {
      name: 'XDC',
      prec: 8,
    },
    {
      name: 'SRX',
      prec: 8,
    },
    {
      name: 'PLI',
      prec: 8,
    },
    {
      name: 'USDG',
      prec: 8,
    },
    {
      name: 'EURG',
      prec: 8,
    },
  ],

  markets: [
    {
      name: 'XDCETH',
      minAmount: 0.00001,
      stock: 'XDC',
      money: 'ETH',
    },
    {
      name: 'XDCBTC',
      minAmount: 0.00001,
      stock: 'XDC',
      money: 'BTC',
    },
    {
      name: 'XDCXRP',
      minAmount: 0.00001,
      stock: 'XDC',
      money: 'XRP',
    },
    {
      name: 'XRPBTC',
      minAmount: 0.00001,
      stock: 'XRP',
      money: 'BTC',
    },
    {
      name: 'ETHBTC',
      minAmount: 0.00001,
      stock: 'ETH',
      money: 'BTC',
    },
    {
      name: 'ETHEUR',
      minAmount: 0.00001,
      stock: 'ETH',
      money: 'EUR',
    },
    {
      name: 'BTCEUR',
      minAmount: 0.00001,
      stock: 'BTC',
      money: 'EUR',
    },
    {
      name: 'SRXXDC',
      minAmount: 0.00001,
      stock: 'SRX',
      money: 'XDC',
    },
    {
      name: 'XRPEUR',
      minAmount: 0.00001,
      stock: 'XRP',
      money: 'EUR',
    },
    {
      name: 'PLIUSDG',
      minAmount: 0.00001,
      stock: 'PLI',
      money: 'USDG',
    },
    {
      name: 'PLIXDC',
      minAmount: 0.00001,
      stock: 'PLI',
      money: 'XDC',
    },
    {
      name: 'EURGEUR',
      minAmount: 0.00001,
      stock: 'EURG',
      money: 'EUR',
    },
  ],
};
