import { NotFoundError, requireAuth, validateRequest } from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { param } from 'express-validator';
import { Order } from '../model/order';

const router = Router();

router.get(
    '/api/orders/:orderId',
    requireAuth,
    [param('orderId').isMongoId().withMessage('orderId must be valid')],
    validateRequest,
    async (req: Request<{ orderId: string }>, res: Response) => {
        //Get the current userId
        const userId = req.currentUser!.id;
        //Find the specific order for the current user
        const order = await Order.findOne({
            userId,
            _id: req.params.orderId,
        }).populate('ticket');

        if (!order) {
            throw new NotFoundError();
        }
        //Send the order back to the user
        res.send(order);
    }
);

export { router as showOrderRouter };
