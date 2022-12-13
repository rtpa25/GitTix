import { Request, Response, Router } from 'express';
import { Ticket } from '../model/ticket';

const router = Router();

router.get(
    '/api/tickets',
    async (
        req: Request<{}, {}, {}, { userId: string; forProfilePage: boolean }>,
        res: Response
    ) => {
        const { userId, forProfilePage } = req.query;

        const findOptions = {
            orderId: undefined,
            userId: userId ? userId : undefined,
        };

        if (!forProfilePage) {
            delete findOptions.userId;
        } else {
            delete findOptions.orderId;
        }

        const tickets = await Ticket.find(findOptions);

        return res.send(tickets);
    }
);

export { router as indexTicketsRouter };
