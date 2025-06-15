import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { checkCardQuerryValidationSchemas, checkValidationSchemas } from "../utils/validationSchemas.mjs";
import { findCardIndexById, findDeckIndexById, findDeckIndexByName } from "../utils/middleware.mjs";
import { decks } from "../utils/consts.mjs";

const router = Router();

router.get("/api/decks/:deckName/cards/",
    findDeckIndexByName,
    (req, res) => { 
        const {
            findDeckByName
        } = req;
        const findDeck = decks[findDeckByName];

        if (!findDeck) return res.sendStatus(404);
    return res.send(findDeck.cards);
});

router.get('/api/decks/:deckName/cards/:cardId',
    findDeckIndexByName,
    findCardIndexById,
    (req, res) => { 
        const {
            findDeckByName,
            indexOfCard
        } = req;
        const findDeck = decks[findDeckByName];
        if (!findDeck) return res.sendStatus(404);
        const findCard = findDeck.cards[indexOfCard];

    return res.send(findCard);
});

router.put('/api/decks/:id', findDeckIndexById, (req, res) => {
    
    const { 
        findDeckIndex,
        body
    } = req;
    
    decks[findDeckIndex] = { id: decks[findDeckIndex].id, ...body};
    return res.sendStatus(200);
})

router.patch('/api/decks/:id', findDeckIndexById, (req, res) => {
    const { 
        findDeckIndex,
        body
    } = req;
    
    decks[findDeckIndex] = { ...decks[findDeckIndex], ...body};
    return res.sendStatus(200);
});

router.delete('/api/decks/:id', findDeckIndexById, (req, res) => {
    const { findDeckIndex } = req;
    decks.splice(findDeckIndex, 1);
    return res.sendStatus(200);
});

router.post('/api/decks', checkSchema(checkValidationSchemas),
    (req, res) => {
    const data = matchedData(req);
    const result = validationResult(req);
    
    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() })

    const newDeck = {id: decks[decks.length - 1].id + 1, ...data};
    decks.push(newDeck);
    return res.status(201).send(newDeck);
});


export default router;