/*
  `prec` is the precision for the asset
  for example:
  1.31 - 2 precisions
  3.1415 - 4 precisions
*/

export default {
  assets: [
    { name: 'XDC', prec: 10 },
    { name: 'BTC', prec: 8 },
    { name: 'EUR', prec: 2 },
    { name: 'ETH', prec: 8 },
    { name: 'XRP', prec: 8 },
    { name: 'EURG', prec: 8 },
    { name: 'SGDG', prec: 8 },
    { name: 'SGD', prec: 8 },
    { name: 'HKDG', prec: 8 },
    { name: 'HKD', prec: 8 },
    { name: 'GBPG', prec: 8 },
    { name: 'GBP', prec: 8 },
    { name: 'USDG', prec: 8 },
    { name: 'USD', prec: 2 },
    { name: 'PLI', prec: 8 },
    { name: 'GBEX', prec: 8 },
    { name: 'LGCY', prec: 8 },
    { name: 'WXDC', prec: 8 },
    { name: 'USDC', prec: 8 },
    { name: 'USDT', prec: 8 },
    { name: 'SRX', prec: 8 }
  ],

  markets: [
    {
      pairId: '0A6FBF6A-5C28-47FC-A863-1E4A55E13068',
      name: 'XDCBTC',
      stock: 'XDC',
      money: 'BTC',
      minAmount: 0.00001
    },
    {
      pairId: '15986160-4063-11eb-b418-b5f9fc0d8db5',
      name: 'BTCEUR',
      stock: 'BTC',
      money: 'EUR',
      minAmount: 0.00001
    },
    {
      pairId: '159b2080-4063-11eb-b418-b5f9fc0d8db5',
      name: 'ETHBTC',
      stock: 'ETH',
      money: 'BTC',
      minAmount: 0.00001
    },
    {
      pairId: '159d4360-4063-11eb-b418-b5f9fc0d8db5',
      name: 'XRPBTC',
      stock: 'XRP',
      money: 'BTC',
      minAmount: 0.00001
    },
    {
      pairId: '159e7be0-4063-11eb-b418-b5f9fc0d8db5',
      name: 'ETHEUR',
      stock: 'ETH',
      money: 'EUR',
      minAmount: 0.00001
    },
    {
      pairId: '159fb460-4063-11eb-b418-b5f9fc0d8db5',
      name: 'EURGEUR',
      stock: 'EURG',
      money: 'EUR',
      minAmount: 0.00001
    },
    {
      pairId: '15a1b030-4063-11eb-b418-b5f9fc0d8db5',
      name: 'SGDGSGD',
      stock: 'SGDG',
      money: 'SGD',
      minAmount: 0.00001
    },
    {
      pairId: '15a30fc0-4063-11eb-b418-b5f9fc0d8db5',
      name: 'HKDGHKD',
      stock: 'HKDG',
      money: 'HKD',
      minAmount: 0.00001
    },
    {
      pairId: '15a46f50-4063-11eb-b418-b5f9fc0d8db5',
      name: 'GBPGGBP',
      stock: 'GBPG',
      money: 'GBP',
      minAmount: 0.00001
    },
    {
      pairId: '15a5f5f0-4063-11eb-b418-b5f9fc0d8db5',
      name: 'USDGUSD',
      stock: 'USDG',
      money: 'USD',
      minAmount: 0.00001
    },
    {
      pairId: '20E9A14C-42B1-4B51-8983-6AD14B5A0B7B',
      name: 'PLIXDC',
      stock: 'PLI',
      money: 'XDC',
      minAmount: 0.00001
    },
    {
      pairId: '2DDD1F99-75D5-4FEE-98CE-9DFAE6B4FAC9',
      name: 'ETHUSDG',
      stock: 'ETH',
      money: 'USDG',
      minAmount: 0.00001
    },
    {
      pairId: '2E90BA4F-300A-447F-B333-D37B545DB24A',
      name: 'BTCEURG',
      stock: 'BTC',
      money: 'EURG',
      minAmount: 0.00001
    },
    {
      pairId: '33D592BA-4EEC-4184-A099-39DEFCF75D79',
      name: 'GBEXXDC',
      stock: 'GBEX',
      money: 'XDC',
      minAmount: 0.00001
    },
    {
      pairId: '34E501D9-5631-4259-80DD-C81872151172',
      name: 'GBEXEURG',
      stock: 'GBEX',
      money: 'EURG',
      minAmount: 0.00001
    },
    {
      pairId: '3A0E1EC3-E5F3-4625-BA53-81721227A864',
      name: 'GBEXXRP',
      stock: 'GBEX',
      money: 'XRP',
      minAmount: 0.00001
    },
    {
      pairId: '3AC58705-72EC-420A-BD1A-F24D0D80B719',
      name: 'GBEXETH',
      stock: 'GBEX',
      money: 'ETH',
      minAmount: 0.00001
    },
    {
      pairId: '573509C5-F588-4D89-92CE-4CCF6512FC3D',
      name: 'XRPEURG',
      stock: 'XRP',
      money: 'EURG',
      minAmount: 0.00001
    },
    {
      pairId: '5F51B065-9901-4571-BC50-0D6A3CD5C24E',
      name: 'XRPUSDG',
      stock: 'XRP',
      money: 'USDG',
      minAmount: 0.00001
    },
    {
      pairId: '6D0DB3AC-99E6-4C33-A664-2089C83A4F93',
      name: 'XRPEUR',
      stock: 'XRP',
      money: 'EUR',
      minAmount: 0.00001
    },
    {
      pairId: '74149DFC-2531-4869-A37F-B0390CC653E2',
      name: 'LGCYXDC',
      stock: 'LGCY',
      money: 'XDC',
      minAmount: 0.00001
    },
    {
      pairId: '7515D851-3C9C-49CB-8BDE-9E3BC220758F',
      name: 'EURGUSDG',
      stock: 'EURG',
      money: 'USDG',
      minAmount: 0.00001
    },
    {
      pairId: '814CA63F-7105-4E66-9314-705E4E0AA19C',
      name: 'ETHEURG',
      stock: 'ETH',
      money: 'EURG',
      minAmount: 0.00001
    },
    {
      pairId: '87F887D2-4D5A-4643-B73D-8D70235F8248',
      name: 'GBEXBTC',
      stock: 'GBEX',
      money: 'BTC',
      minAmount: 0.00001
    },
    {
      pairId: 'A2732217-1295-4E03-BA4E-43691D052EA1',
      name: 'BTCUSDG',
      stock: 'BTC',
      money: 'USDG',
      minAmount: 0.00001
    },
    {
      pairId: 'A68D93EA-2A85-441D-AB60-C4AF3CF2EB39',
      name: 'WXDCXDC',
      stock: 'WXDC',
      money: 'XDC',
      minAmount: 0.00001
    },
    {
      pairId: 'B254A96D-BC5F-412C-BE77-7A3992CB3CD8',
      name: 'XDCEURG',
      stock: 'XDC',
      money: 'EURG',
      minAmount: 0.00001
    },
    {
      pairId: 'B44BFE2C-0096-415C-AD96-04C19696820D',
      name: 'GBEXUSDG',
      stock: 'GBEX',
      money: 'USDG',
      minAmount: 0.00001
    },
    {
      pairId: 'B463FA8E-3484-4BFF-8B6A-BE8D6197357A',
      name: 'XDCUSDG',
      stock: 'XDC',
      money: 'USDG',
      minAmount: 0.00001
    },
    {
      pairId: 'BEFC2A16-AAFD-4A10-AD61-F61C43DAC165',
      name: 'USDGUSDC',
      stock: 'USDG',
      money: 'USDC',
      minAmount: 0.00001
    },
    {
      pairId: 'C2CB9A43-1C92-4637-B618-F536AB8BEE1F',
      name: 'PLIUSDG',
      stock: 'PLI',
      money: 'USDG',
      minAmount: 0.00001
    },
    {
      pairId: 'CCDB853E-B180-4D43-87C4-6FD3C3B0EADA',
      name: 'XDCETH',
      stock: 'XDC',
      money: 'ETH',
      minAmount: 0.00001
    },
    {
      pairId: 'D7BBDB13-5CBD-4BE4-A4B5-A1A5AFD404A7',
      name: 'XDCXRP',
      stock: 'XDC',
      money: 'XRP',
      minAmount: 0.00001
    },
    {
      pairId: 'EE987C72-F84C-43EB-AA44-DD6AD79B84E5',
      name: 'GBEXEUR',
      stock: 'GBEX',
      money: 'EUR',
      minAmount: 0.00001
    },
    {
      pairId: 'F4D1BD9A-3760-4592-A9B4-81591AEA1239',
      name: 'USDGUSDT',
      stock: 'USDG',
      money: 'USDT',
      minAmount: 0.00001
    },
    {
      pairId: 'F611B457-2AD1-44DF-AE93-66215FB47B0D',
      name: 'SRXXDC',
      stock: 'SRX',
      money: 'XDC',
      minAmount: 0.00001
    }
  ]
};

