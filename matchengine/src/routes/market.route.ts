import { Router } from 'express';
import marketController from '../controllers/market.controller';

const router = Router();

router.get('/marketList', marketController.list);
router.put('/marketSummary', marketController.summary);

export default router;