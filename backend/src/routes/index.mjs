import { Router } from "express";
import decksRouter from './decks.mjs'
import cardsRouter from './cards.mjs'

const router = Router();

router.use(decksRouter);
router.use(cardsRouter);

export default router;