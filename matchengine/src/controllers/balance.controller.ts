import { Request, Response } from 'express';
import db from '../database/queries';

class BalanceController {
    async query(req: Request, res: Response) {
        const { userId, assets } = req.body;
        const response = await db.getBalance(userId, ...assets);
        return res.json(response);
    }

    async update(req: Request, res: Response) {
        const { user_id, asset, business, business_id, change, detail } = req.body;
        const response = await db.updateBalance(user_id, asset, business, business_id, change, detail);
        return res.json(response);
    }
}

export default new BalanceController();