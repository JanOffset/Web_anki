import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { checkCardValidationSchemas, checkValidationSchemas } from "../utils/validationSchemas.mjs";
import { findCardIndexById, findDeckIndexById, findDeckIndexByName } from "../utils/middleware.mjs";
import { decks } from "../utils/consts.mjs";

const router = Router();

router.get("/api/decks/:deckName/cards/",
    checkSchema(checkCardValidationSchemas),
    findDeckIndexByName,
    (req, res) => { 
        const {
            findDeckByName
        } = req;
        const data = matchedData(req);
        const result = validationResult(req);
        const findDeck = decks[findDeckByName];

        if (!result) return res.status(400).send({ errors: result.array()});

        if (!findDeck) return res.sendStatus(404);

        if (data.filter && data.value) return res.send(findDeck.cards.filter(
            (card) => card[data.filter].includes(data.value))
        );

        return res.send(findDeck.cards);
    }
);

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
    }
);

router.put('/api/decks/:deckName/cards/:cardId',
    findDeckIndexByName,
    findCardIndexById,
    (req, res) => {
        const { 
            findDeckByName,
            indexOfCard,
            body,
            params: {
                cardId
            }
        } = req;
        
        const parsedId = parseInt(cardId);
        decks[findDeckByName].cards[indexOfCard] = { card_id: parsedId, ...body};
        return res.sendStatus(200);
    }
);

router.patch('/api/decks/:deckName/cards/:cardId',
    findDeckIndexByName,
    findCardIndexById,
    (req, res) => {
        const { 
            findDeckByName,
            indexOfCard,
            body,
            params: {
                cardId
            }
        } = req;
        
        const parsedId = parseInt(cardId);
        decks[findDeckByName].cards[indexOfCard] = { card_id: parsedId, ...decks[findDeckByName].cards[indexOfCard], ...body};
        return res.sendStatus(200);
    }
);

router.delete('/api/decks/:deckName/cards/:cardId',
    findDeckIndexByName,
    findCardIndexById,
    (req, res) => {
        const { 
            findDeckByName,
            indexOfCard
        } = req;
        decks[findDeckByName].cards.splice(indexOfCard, 1);
        return res.sendStatus(200);
    }
);

router.post('/api/decks/:deckName/cards/',
    checkSchema(checkCardValidationSchemas),
    (req, res) => {
        const {
            findDeckByName
        } = req;
        const data = matchedData(req);
        const result = validationResult(req);
        
        if (!result.isEmpty()) return res.status(400).send({ errors: result.array() })

        const newCard = { card_id: decks[findDeckByName].cards.length, ...data};
        decks[findDeckByName].cards.push(newCard);
        return res.status(201).send(newCard);
    }
);

export default router;