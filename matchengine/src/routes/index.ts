import { Router } from 'express';
import balance from './balance.route';
import market from './balance.route';
import asset from './asset.route';

const router = Router();

router.use(balance);
router.use(market);
router.use(asset);

export default router;