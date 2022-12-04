import { Request, Response, Router } from 'express';
import { Ticket } from '../model/ticket';

const router = Router();

router.get(
    '/api/tickets',
    async (req: Request<{ id: string }>, res: Response) => {
        const tickets = await Ticket.find({});

        return res.send(tickets);
    }
);

export { router as indexTicketsRouter };
