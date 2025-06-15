import express from "express";
import { query, validationResult, body, matchedData, checkSchema} from "express-validator"
import { checkValidationSchemas, checkQuerryValidationSchemas } from './utils/validationSchemas.mjs'
import deckRouter from './routes/decks.mjs'
import cardRouter from './routes/cards.mjs'
import {decks} from './utils/consts.mjs'
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(deckRouter)
app.use(cardRouter)

app.get('/',
    (req, res) => {
    res.send("main page");
});

app.get('/api/decks/2/italian_deck', (req, res) => {
    const {
        query: {filter, value}
    } = req;

    if (filter && value) return req.send(italian_deck.filter((italian) => italian[filter].includes(value)));

    return res.send(italian_deck);
});

app.get('/api/decks/2/italian_deck/:id', (req, res) => {
    const parsedId = parseInt(req.params.id);

    if (isNaN(parsedId)) return res.status(400).send({msg: "Bad request" });
    const findCard = italian_deck.find((card) => card.card_id === parsedId);
    if (!findCard) return res.sendStatus(400); 
    return res.send(italian_deck);
})


app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

