import { Router } from "express";
import deckRepository from "./repositories/deck_repository.mjs"
import runDbMigration from "../../migration/runDbMigration.mjs";

const router = Router();

router.post('/api/db/insert', async (req, res) => {
        const result = await deckRepository.create(req.body);

        res.status(201).send(result);
    }
)

export default router