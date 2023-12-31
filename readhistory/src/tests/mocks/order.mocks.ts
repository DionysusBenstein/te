import { DealHistory } from "../../typings/types/deal-history.return-type";
import { OrderDetail } from "../../typings/types/order-detail.return-type";
import { OrderHistory } from "../../typings/types/order-history.return-type";

export const dealHistoryMock: DealHistory[] = [
  {
    amount: 1,
    deal: 1,
    deal_fee: 1,
    deal_id: 1,
    deal_order_id: 1,
    fee: 1,
    id: 1,
    order_id: 1,
    price: 1,
    role: 1,
    time: "2019-09-09",
    user_id: 1,
  },
  {
    amount: 2,
    deal: 2,
    deal_fee: 2,
    deal_id: 2,
    deal_order_id: 2,
    fee: 2,
    id: 2,
    order_id: 2,
    price: 2,
    role: 2,
    time: "2020-09-09",
    user_id: 2,
  },
];

export const orderHistoryMock: OrderHistory[] = [
  {
    amount: 1,
    deal_fee: 1,
    id: 1,
    price: 1,
    user_id: 1,
    create_time: "2019-09-09",
    deal_money: 1,
    deal_stock: 1,
    update_time: "2020-09-09",
    maker_fee: 1,
    market: "mock market 1",
    side: 1,
    source: "mock source 1",
    t: 1,
    taker_fee: 1,
  },
  {
    amount: 2,
    deal_fee: 2,
    id: 2,
    price: 2,
    user_id: 2,
    create_time: "2021-09-09",
    deal_money: 2,
    deal_stock: 2,
    update_time: "2022-09-09",
    maker_fee: 2,
    market: "mock market 2",
    side: 2,
    source: "mock source 2",
    t: 2,
    taker_fee: 2,
  },
];

export const orderDetailMock: OrderDetail[] = [
  {
    amount: 1,
    deal_fee: 1,
    id: 1,
    price: 1,
    user_id: 1,
    create_time: "2019-09-09",
    deal_money: 1,
    deal_stock: 1,
    update_time: "2020-09-09",
    maker_fee: 1,
    market: "mock market 1",
    side: 1,
    source: "mock source 1",
    t: 1,
    taker_fee: 1,
  },
  {
    amount: 2,
    deal_fee: 2,
    id: 2,
    price: 2,
    user_id: 2,
    create_time: "2021-09-09",
    deal_money: 2,
    deal_stock: 2,
    update_time: "2022-09-09",
    maker_fee: 2,
    market: "mock market 2",
    side: 2,
    source: "mock source 2",
    t: 2,
    taker_fee: 2,
  },
];
