import { Router } from "express";
import decksRouter from './decks.mjs'
import cardsRouter from './cards.mjs'
import dbRouter from './db.mjs'
import userRouter from './users.mjs'

// import authRouter from './auth.mjs'

const router = Router();

// router.use(authRouter);
router.use(decksRouter);
router.use(cardsRouter);
//router.use(dbRouter);
router.use(userRouter);

export default router;