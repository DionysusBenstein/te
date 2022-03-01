import { Router } from 'express';
import assetController from '../controllers/market.controller';

const router = Router();

router.get('/assetList', assetController.list);
router.put('/assetSummary', assetController.summary);

export default router;