import depthController from './controllers/depth.controller';
import orderController from './controllers/order.controller';
import assetController from './controllers/asset.controller';
import dealController from './controllers/deal.controller';
import todayController from './controllers/today.controller';
import stateController from './controllers/state.controller';
import priceController from './controllers/price.controller';
import klineController from './controllers/kline.controller';

export const methods = {
  kline: {
    query: klineController.query,
    subscribe: klineController.subscribe,
    update: klineController.update,
    unsubscribe: klineController.unsubscribe,
  },
  price: {
    query: priceController.query,
    subscribe: priceController.subscribe,
    update: priceController.update,
    unsubscribe: priceController.unsubscribe,
  },
  state: {
    query: stateController.query,
    subscribe: stateController.subscribe,
    update: stateController.update,
    unsubscribe: stateController.unsubscribe,
  },
  today: {
    query: todayController.query,
    subscribe: todayController.subscribe,
    update: todayController.update,
    unsubscribe: todayController.unsubscribe,
  },
  deals: {
    query: dealController.query,
    subscribe: dealController.subscribe,
    update: dealController.update,
    unsubscribe: dealController.unsubscribe,
  },
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
