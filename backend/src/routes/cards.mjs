import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { cardValidationSchema } from '../utils/validationSchemas.mjs'
import { Card } from "../mongoose/schemas/card.mjs";
import { Deck } from "../mongoose/schemas/deck.mjs";
import { userLoggedIn } from "../utils/middleware.mjs";

const router = Router();

//get all cards
router.get('/api/deck/:deckname/cards', userLoggedIn, async (req, res) => {
    const { 
        query: {
            deckname
        },
        user: {
            id
        } 
    } = req;

    try {
        const deck = await Deck.findOne({deckname: deckname, userId: id});
        if (!deck) return res.status(400).send({error: 'Deck doesnt exist'});
        const cards = await Card.find({deckId: deck._id, userId: id});
        if (!cards) {
            cards = 0;
        }
        return res.send(cards)
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

//create a new card in a deck
router.post('/api/deck/:deckname/card', userLoggedIn, checkSchema(cardValidationSchema), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send({errors: result.array()});
    const data = matchedData(req);
    
    try {    
        const deck = await Deck.findOne({deckname: req.params.deckname, userId: req.user.id});
        if (!deck) return res.status(400).send({error: 'Deck doesnt exist'});
        const card = new Card({...data, userId: req.user.id, deckId: deck._id});
        await card.save();
        deck.cardIds.push(card._id);
        await deck.save();
        return res.status(200).send(card);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

//edit a card
router.patch('/api/deck/:deckname/card/:cardId', userLoggedIn, async (req, res) => {
    const {
        params: {
            deckname,
            cardId
        },
        body: {
            newQuestion,
            newAnswer
        },
        user: {
            id
        }
    } = req;

    try {
        if (!newQuestion || !newAnswer) return res.status(400).send({erro: 'Neither question or answer can be empty'});
        const deck = await Deck.findOne({deckname: deckname, userId: id});
        if (!deck) return res.sendStatus(400);
        const editCard = await Card.findOne({_id: cardId, deckId: deck._id, userId: id});
        if (!editCard) return res.sendStatus(400);

        editCard.answer = newAnswer;
        editCard.question = newQuestion;
        await editCard.save();
        return res.status(200).send({answer: newAnswer, question: newQuestion});
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

//delete a card
router.delete('/api/deck/:deckname/card/:cardId', userLoggedIn, async (req, res) => {
    const {
        params: {
            deckname,
            cardId
        },
        user: {
            id
        }
    } = req;

    try {
        const deck = await Deck.findOne({deckname: deckname, userId: id});
        if (!deck) return res.sendStatus(400);
        const deleteCard = await Card.findOneAndDelete({_id: cardId, deckId: deck._id, userId: id});
        if (!deleteCard) return res.status(400).send({error: 'Card not found'});
        deck.cardIds.pull(deleteCard._id);
        await deck.save();
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(403);
    }
});

export default router;