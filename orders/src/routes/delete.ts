import { NotFoundError, requireAuth, validateRequest } from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { param } from 'express-validator';
import { Order, OrderStatus } from '../model/order';

const router = Router();

router.delete(
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
        });

        if (!order) {
            throw new NotFoundError();
        }
        //Change the status of the order to cancelled

        order.status = OrderStatus.Cancelled;
        await order.save();

        //TODO: Publish an event saying that an order was cancelled

        //Send the order back to the user
        res.send(order);
    }
);

export { router as deleteOrderRouter };
