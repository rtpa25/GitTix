import { Request, Response, Router } from 'express';
import { currentUser } from '../middlewares/current-user';

const router = Router();

router.get(
    '/api/users/currentuser',
    currentUser,
    (req: Request, res: Response) => {
        res.send({ currentUser: req.currentUser || null });
    }
);

export { router as currentUserRouter };
