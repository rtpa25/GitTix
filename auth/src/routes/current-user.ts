import { currentUser } from '@rp-gittix/common';
import { Request, Response, Router } from 'express';

const router = Router();

router.get(
    '/api/users/currentuser',
    currentUser,
    (req: Request, res: Response) => {
        res.send({ currentUser: req.currentUser || null });
    }
);

export { router as currentUserRouter };
