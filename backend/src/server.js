import express from "express";
import { query, validationResult, body, matchedData, checkSchema} from "express-validator"
import { checkValidationSchemas, checkQuerryValidationSchemas } from './utils/validationSchemas.mjs'
import deckRouter from './routes/decks.mjs'
import {decks} from './utils/consts.mjs'
const app = express();
const PORT = process.env.PORT || 3000;

//middleware izprashtane na json http zaqvki
app.use(express.json());
app.use(deckRouter)

const loggingMiddleWare = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
}

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
// middleware e funkciq koqto ima dostup do reqestai responda
// moga da podavam kolkoto si iska, moje da sa globalni; zaduljitelno ima next(), ako e izpulneno iziskvaneto
app.use(loggingMiddleWare);

// const italian_deck = [
//     {card_id: 1, card_question: "what does ciao, mean?"}
// ]

app.get('/',
    (req, res) => {
    res.send("main page");
});

//vijdame samo edin deck sus specifichno id
app.get('/api/decks/:id', findDeckIndexById, (req, res) => {
    const {
        findDeckIndex,
    } = req;
    const findDeck = decks[findDeckIndex];
    if (!findDeck) return res.sendStatus(400);
    return res.send(findDeck);
});

app.get('/api/decks/2/italian_deck', (req, res) => {
    const {
        query: {filter, value}
    } = req;

    if (filter && value) return req.send(italian_deck.filter((italian) => italian[filter].includes(value)));

    return res.send(italian_deck);
});

//vijdame karta sus specifichno cardid
app.get('/api/decks/2/italian_deck/:id', (req, res) => {
    const parsedId = parseInt(req.params.id);

    if (isNaN(parsedId)) return res.status(400).send({msg: "Bad request" });
    const findCard = italian_deck.find((card) => card.card_id === parsedId);
    if (!findCard) return res.sendStatus(400); 
    return res.send(italian_deck);
})

app.put('/api/decks/:id', findDeckIndexById, (req, res) => {
    
    // razberi kak raboti destructuring
    /*
    imashe problem pri 
    const {
        params: {id},
        body
    } = req;
    */
    const { 
        findDeckIndex,
        body
    } = req;
    
    decks[findDeckIndex] = { id: decks[findDeckIndex].id, ...body};
    return res.sendStatus(200);
})

app.patch('/api/decks/:id', findDeckIndexById, (req, res) => {
    const { 
        findDeckIndex,
        body
    } = req;
    
    decks[findDeckIndex] = { ...decks[findDeckIndex], ...body};
    return res.sendStatus(200);
});

app.delete('/api/decks/:id', findDeckIndexById, (req, res) => {
    const { findDeckIndex } = req;
    decks.splice(findDeckIndex, 1);
    return res.sendStatus(200);
});

//zaqvka za suzdavane na nov deck
app.post('/api/decks', checkSchema(checkValidationSchemas),
    (req, res) => {
    const data = matchedData(req);
    const result = validationResult(req);
    
    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() })

    const newDeck = {id: decks[decks.length - 1].id + 1, ...data};
    decks.push(newDeck);
    return res.status(201).send(newDeck);
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

