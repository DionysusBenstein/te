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
      prec: 2
    },
    {
      name: 'USD',
      prec: 2
    },
    {
      name: 'BTC',
      prec: 8
    },
    {
      name: 'ETH',
      prec: 8
    },
    {
      name: 'SRX',
      prec: 8
    },
    {
      name: 'XDC',
      prec: 8
    },
    {
      name: 'SGD',
      prec: 8
    },
    {
      name: 'AUD',
      prec: 8
    },
    {
      name: 'USDG',
      prec: 8
    },
    {
      name: 'XRP',
      prec: 8
    },
    {
      name: 'PLI',
      prec: 8
    },
    {
      name: 'EURG',
      prec: 8
    },
    {
      name: 'SGDG',
      prec: 8
    },
    {
      name: 'HKDG',
      prec: 8
    },
    {
      name: 'HKD',
      prec: 8
    },
    {
      name: 'GBPG',
      prec: 8
    },
    {
      name: 'GBP',
      prec: 8
    }
  ],

  markets: [
    {
      pairId: 'AAC77513-6F3A-4039-A4E8-FD6D89DC9C98',
      name: 'SRXXDC',
      stock: 'SRX',
      money: 'XDC',
      minAmount: 0.00001
    },
    {
      pairId: 'E2782D6B-6C64-4810-A768-ABDA685C681B',
      name: 'BTCUSD',
      stock: 'BTC',
      money: 'USD',
      minAmount: 0.00001
    },
    {
      pairId: '8145A42A-024A-4817-BAA9-9CC0DDDBDA2C',
      name: 'BTCSGD',
      stock: 'BTC',
      money: 'SGD',
      minAmount: 0.00001
    },
    {
      pairId: '4A38A0B7-8AB0-4B22-84EC-02BB24107395',
      name: 'ETHAUD',
      stock: 'ETH',
      money: 'AUD',
      minAmount: 0.00001
    },
    {
      pairId: '7BA23491-A29F-4D20-B4B2-5546EDC79218',
      name: 'XDCUSDG',
      stock: 'XDC',
      money: 'USDG',
      minAmount: 0.00001
    },
    {
      pairId: '91F10A20-A013-45D0-9E68-1E3E2F46E6AD',
      name: 'XRPUSD',
      stock: 'XRP',
      money: 'USD',
      minAmount: 0.00001
    },
    {
      pairId: 'DA712967-66AD-4EE5-8AA8-32B1698EACE2',
      name: 'XRPAUD',
      stock: 'XRP',
      money: 'AUD',
      minAmount: 0.00001
    },
    {
      pairId: '0F955215-423B-410B-AEE7-48CA34F21CB6',
      name: 'XRPSGD',
      stock: 'XRP',
      money: 'SGD',
      minAmount: 0.00001
    },
    {
      pairId: '66166CC6-277F-41E7-A0FB-9CA067F447C5',
      name: 'XRPEUR',
      stock: 'XRP',
      money: 'EUR',
      minAmount: 0.00001
    },
    {
      pairId: 'CB5BC8DA-B6FB-48E0-8973-239CC0FC6B18',
      name: 'XDCETH',
      stock: 'XDC',
      money: 'ETH',
      minAmount: 0.00001
    },
    {
      pairId: '4744EFBA-A232-43B3-8AE0-A73096AF6083',
      name: 'PLIUSDG',
      stock: 'PLI',
      money: 'USDG',
      minAmount: 0.00001
    },
    {
      pairId: '4D657231-1346-425D-B794-38AB679B5795',
      name: 'XDCEURG',
      stock: 'XDC',
      money: 'EURG',
      minAmount: 0.00001
    },
    {
      pairId: '3F26547A-09DB-4AC2-BB22-F352FB7E184D',
      name: 'XDCXRP',
      stock: 'XDC',
      money: 'XRP',
      minAmount: 0.00001
    },
    {
      pairId: '5971AE0C-BA09-450C-8188-498F4E713391',
      name: 'BTCAUD',
      stock: 'BTC',
      money: 'AUD',
      minAmount: 0.00001
    },
    {
      pairId: '62782208-69B5-4B97-8C4C-AB02C3D64E08',
      name: 'XDCBTC',
      stock: 'XDC',
      money: 'BTC',
      minAmount: 0.00001
    },
    {
      pairId: '5E3DB120-3FE6-4740-A8EA-B666A705D4CF',
      name: 'ETHSGD',
      stock: 'ETH',
      money: 'SGD',
      minAmount: 0.00001
    },
    {
      pairId: 'F759AB76-3364-43FC-A1E8-F366FED1B844',
      name: 'PLIXDC',
      stock: 'PLI',
      money: 'XDC',
      minAmount: 0.00001
    },
    {
      pairId: 'd7f092e0-3dfd-11eb-8a60-ede2d1cfaec6',
      name: 'BTCEUR',
      stock: 'BTC',
      money: 'EUR',
      minAmount: 0.00001
    },
    {
      pairId: 'd8476570-3dfd-11eb-8a60-ede2d1cfaec6',
      name: 'ETHBTC',
      stock: 'ETH',
      money: 'BTC',
      minAmount: 0.00001
    },
    {
      pairId: 'd89b9ff0-3dfd-11eb-8a60-ede2d1cfaec6',
      name: 'XRPBTC',
      stock: 'XRP',
      money: 'BTC',
      minAmount: 0.00001
    },
    {
      pairId: 'd8ef3e30-3dfd-11eb-8a60-ede2d1cfaec6',
      name: 'ETHEUR',
      stock: 'ETH',
      money: 'EUR',
      minAmount: 0.00001
    },
    {
      pairId: 'd9428e50-3dfd-11eb-8a60-ede2d1cfaec6',
      name: 'EURGEUR',
      stock: 'EURG',
      money: 'EUR',
      minAmount: 0.00001
    },
    {
      pairId: 'd9962c90-3dfd-11eb-8a60-ede2d1cfaec6',
      name: 'SGDGSGD',
      stock: 'SGDG',
      money: 'SGD',
      minAmount: 0.00001
    },
    {
      pairId: 'd9ec62e0-3dfd-11eb-8a60-ede2d1cfaec6',
      name: 'HKDGHKD',
      stock: 'HKDG',
      money: 'HKD',
      minAmount: 0.00001
    },
    {
      pairId: 'da411290-3dfd-11eb-8a60-ede2d1cfaec6',
      name: 'GBPGGBP',
      stock: 'GBPG',
      money: 'GBP',
      minAmount: 0.00001
    },
    {
      pairId: 'da94d7e0-3dfd-11eb-8a60-ede2d1cfaec6',
      name: 'USDGUSD',
      stock: 'USDG',
      money: 'USD',
      minAmount: 0.00001
    }
  ],
};
