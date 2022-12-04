import { NotFoundError } from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { Ticket } from '../model/ticket';
import mongoose from 'mongoose';

const router = Router();

router.get(
    '/api/tickets/:id',
    async (req: Request<{ id: string }>, res: Response) => {
        const ticketId = req.params.id;

        if (!mongoose.isValidObjectId(ticketId)) {
            throw new NotFoundError();
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }

        return res.status(200).send(ticket);
    }
);

export { router as showTicketRouter };
