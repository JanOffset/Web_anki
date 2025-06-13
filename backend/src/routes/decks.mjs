import { Router } from "express";
import { query, validationResult } from "express-validator";
import { checkValidationSchemas, checkQuerryValidationSchemas } from './utils/validationSchemas.mjs'
import {decks} from '../utils/consts.mjs'
const router = Router();

router.get('/api/decks', checkSchema(checkQuerryValidationSchemas), 
(req, res) => {
    // destructuring => same as const filter = req.query.filter;
    // const result = validationResult(req);
    // const data = matchedData(req);
    // const { filter, value } = data;
    // console.log(filter)
    // console.log(value)
    // console.log(decks.filter(deck => deck.includes(filter)))
    // if (filter) return res.send(decks.includes(filter))
    // if (!filter) return res.send(decks)

    // if (!filter && value) return res.status(400).send({ msg: "Can have filter value without filter", errors: result.array()})
    
    // if (filter && !value) return res.status(400).send({ msg: "Can have filter without filter value", errors: result.array()})

    // if (filter && value) return res.send(decks.filter((deck) => deck[filter].includes(value)));

    // if (!filter && !value) return res.send(decks);
    const data = matchedData(req);
    console.log(decks.some(data.filter))
    if (filter && value) return res.send(decks.filter(deck => deck[filter].includes(value)));

    return res.send(decks);
});

export default router;