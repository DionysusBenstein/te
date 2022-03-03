import { Request, Response } from 'express';
import db from '../database/queries';

class BalanceController {
    async query(userId: number, ...assets: string[]) {
        const response = await db.getBalance(userId, ...assets);
        return response;
    }

    async update(userId: number, asset: string, business: string, businessId: number, change: number, detail: object) {
        const response = await db.updateBalance(userId, asset, business, businessId, change, detail);
        return response;
    }

    async history(userId: number, asset: string, business: string, startTime: Date, endTime: Date, offset: number, limit: number) {
        const response = await db.getBalanceHistory(userId, asset, business, startTime, endTime, offset, limit);
        return response;
    }
}

export default new BalanceController();