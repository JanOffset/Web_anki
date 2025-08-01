import { Router } from "express";
import decksRouter from './decks.mjs'
import cardsRouter from './cards.mjs'
import userRouter from './users.mjs'
import authRouter from './auth.mjs'

const router = Router();

router.use(decksRouter);
router.use(cardsRouter);
router.use(authRouter);
router.use(userRouter);

export default router;