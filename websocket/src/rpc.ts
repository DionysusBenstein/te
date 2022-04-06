import depthController from './controllers/depth.controller';
import orderController from './controllers/order.controller';
import assetController from './controllers/asset.controller';

export const methods = {
  kline: {},
  price: {},
  state: {},
  today: {},
  deals: {},
  depth: {
    query: depthController.query,
    subscribe: depthController.subscribe,
    update: depthController.update,
    unsubscribe: depthController.unsubscribe,
  },
  order: {
    query: orderController.query,
    history: orderController.history,
    subscribe: orderController.subscribe,
    update: orderController.update,
    unsubscribe: orderController.unsubscribe,
  },
  asset: {
    query: assetController.query,
    history: assetController.history,
    subscribe: assetController.subscribe,
    update: assetController.update,
    unsubscribe: assetController.unsubscribe,
  },
};
