import { Request, Response } from 'express';
import db from '../database/queries';

class AssetController {
    async list(req: Request, res: Response) {
        const response = await db.getAssetList();
        return res.json(response);
    }

    async summary(req: Request, res: Response) {
        const { marketList } = req.body;
        const response = await db.getAssetSummary(marketList);
        return res.json(response);
    }
}

export default new AssetController();