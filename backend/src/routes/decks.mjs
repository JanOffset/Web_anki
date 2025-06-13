import { Router } from "express";
import { query, checkSchema, matchedData, validationResult, body } from "express-validator";
import { checkValidationSchemas, checkQuerryValidationSchemas, checkIdValidationSchemas } from '../utils/validationSchemas.mjs'
import {decks} from '../utils/consts.mjs'
const router = Router();

const findDeckIndexById = (req, res, next) => {
    const {
        params: { id },
    } = req;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findDeckIndex = decks.findIndex((deck) => deck.id === parsedId)
    if (findDeckIndex === -1) return res.sendStatus(400);
    req.findDeckIndex = req;
    next();
}

router.get("/api/decks",
    checkSchema(checkQuerryValidationSchemas), 
    (req, res) => {
        const result = validationResult(req);
        const data = matchedData(req)
        
        if (data.filter && data.value) return res.send(decks.filter((deck) => deck[data.filter].includes(data.value)));
        
        console.log(result)    
    return res.send(decks);
});

router.get('/api/decks/:id',
    findDeckIndexById,
    checkSchema(checkIdValidationSchemas),
    (req, res) => {
        console.log(req.findDeckIndex + " this is the findDeckindex");
        console.log(req.id + " this is the id")
        const result = validationResult(req);
        const data = matchedData(req);
        console.log(data + "this is the decks index")
        console.log(result)
        const {
            findDeckIndex,
        } = req;
        console.log(findDeckIndex + "findDeckIndex")
        const findDeck = decks[findDeckIndex];
        console.log(findDeck + "findDeck")
        if (!findDeck) return res.sendStatus(400);
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

    const newDeck = {id: decks[decks.length - 1].id + 1, ...data};
    decks.push(newDeck);
    return res.status(201).send(newDeck);
});

export default router;
