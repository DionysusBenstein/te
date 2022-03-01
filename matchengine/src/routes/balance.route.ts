import { Router } from 'express';
import balanceController from '../controllers/balance.controller';

const router = Router();

router.post('/getBalance', balanceController.query);
router.put('/updateBalance', balanceController.update);

export default router;