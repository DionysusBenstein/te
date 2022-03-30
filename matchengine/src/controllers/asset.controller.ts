import { AssetSummaryParams } from '../dto/asset-summary-params.dto';
import assetService from '../services/asset.service';
import { validateAndConvert } from '../utils/validation.util';

class AssetController {
  list() {
    return assetService.list();
  }

  async summary(params: AssetSummaryParams) {
    const { data, errors } = await validateAndConvert(
      AssetSummaryParams,
      params
    );

    if (errors) {
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    return await assetService.summary(data);
  }
}

export default new AssetController();
