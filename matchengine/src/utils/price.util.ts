import { sequelize } from '../config/database.config';
import { QueryTypes } from 'sequelize';

export async function getAssetUsdPrice(assetName: string): Promise<number> {
  const MSSERVER_MISSING_CURRENCY = { usdPrice: 0 };
  const usdPriceQueryResult: any = await sequelize.query(
    'SELECT usdPrice from LivePrice WHERE currencyName = :assetName AND deletedAt is NULL', {
    replacements: { assetName },
    plain: true,
    raw: true,
    type: QueryTypes.SELECT
  });

  return (usdPriceQueryResult || MSSERVER_MISSING_CURRENCY).usdPrice;
}