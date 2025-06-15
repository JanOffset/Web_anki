import { Router } from "express";
import { query, checkSchema, matchedData, validationResult, body } from "express-validator";
import { checkValidationSchemas, checkQuerryValidationSchemas} from '../utils/validationSchemas.mjs'
import {decks} from '../utils/consts.mjs'
import {findDeckIndexById} from "../utils/middleware.mjs"
const router = Router();

router.get("/api/decks/",
    checkSchema(checkQuerryValidationSchemas), 
    (req, res) => {
        const result = validationResult(req);
        const data = matchedData(req)
        
        if (!result.isEmpty()) return res.status(400).send({ errors: result.array()})

        if (data.filter && data.value) return res.send(decks.filter(
            (deck) => deck[data.filter].includes(data.value))
        );

        return res.send(decks);
    }
);

router.get('/api/decks/:id',
    findDeckIndexById,
    (req, res) => {
        const {
            findDeckIndex,
        } = req;
        const findDeck = decks[findDeckIndex];

        if (!findDeck) return res.sendStatus(404);
    return res.send(findDeck);
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

    const newDeck = {id: decks[decks.length].id, ...data};
    decks.push(newDeck);
    return res.status(201).send(newDeck);
});

export default router;
