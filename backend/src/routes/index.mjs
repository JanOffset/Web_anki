import { Router } from "express";
import decksRouter from './decks.mjs'
import cardsRouter from './cards.mjs'
// import authRouter from './auth.mjs'

const router = Router();

// router.use(authRouter);
router.use(decksRouter);
router.use(cardsRouter);

export default router;