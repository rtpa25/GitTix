import { requireAuth } from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { Order } from '../model/order';

const router = Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
    //Get the current userId
    const userId = req.currentUser!.id;
    //Find all orders for the current user
    const orders = await Order.find({ userId }).populate('ticket');
    //Send the orders back to the user
    res.send(orders);
});

export { router as indexOrderRouter };
