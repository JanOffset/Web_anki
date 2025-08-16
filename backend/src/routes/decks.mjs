import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { deckValidationSchemas } from '../utils/validationSchemas.mjs'
import { Deck } from "../mongoose/schemas/deck.mjs"; 
import { findDeckByName } from "../utils/middleware.mjs";
import { userLoggedIn } from "../utils/middleware.mjs";

const router = Router();

//display deck by name, or all decks if not found
router.get('/api/deck', userLoggedIn, async (req, res) => {
    const { 
        body: {
            deckname
        },
        user: {
            id
        }
    } = req;
    
    const deck = await findDeckByName(deckname, id);
    
    if (deck) {
        const deckInfo = {
            name: deck.deckname,
            alternative: deck.alternativeName,
            cardCount: deck.cards ? deck.cards.length : 0,
            
        };
        return res.send(deckInfo);
    }
    
    //if deck not found return all decks
    const dbDecks = await Deck.find();
    const allDecks = dbDecks.map(deck => ({
        name: deck.deckname,
        alternative: deck.alternativeName,
        cardCount: deck.cards ? deck.cards.length : 0,
    }));
    
    return res.send(allDecks);
});

//add new deck
router.post('/api/deck/create', userLoggedIn, checkSchema(deckValidationSchemas), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }
    
    const data = matchedData(req);
    const newDeck = new Deck({...data, userId: req.user.id});
    
    //ccheck if deckname exists
    const existingDeck = await Deck.findOne({ deckname: data.deckname, userId: req.user.id})
    if (existingDeck) {
        return res.status(400).send({ error: 'Deck name already exists' });
    }
   
    try { 
        await newDeck.save();
        return res.status(201).send({message: 'Deck created'});   
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

//remove deck by name
router.delete('/api/deck/remove/:deckname', userLoggedIn, async (req, res) => {
    const { 
        params: {
            deckname
        },
        user: {
            id
        }
    } = req;
    try {
        const deck = await findDeckByName(deckname, id);        
        if (!deck) return res.sendStatus(400);
        await Deck.findOneAndDelete({userId: id, deckname: deckname});
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400)
    }
});

//rename deck
router.patch('/api/deck/edit', userLoggedIn, async (req, res) => {
    const { 
        body: {
            deckname,   
            newName,
            newAltName
        },
        user: {
            id
        }
    } = req;
    
    if (!deckname) return res.status(400).send({error: 'Deckname is required'})
    if (!newName) return res.status(400).send({ error: 'New name is required' });
    
    try { 
        await Deck.findOneAndUpdate(id, {deckname: convertNameFromUrl(newName), alternativeName: newAltName ? newAltName : deckname});
        return res.send({deckname: newName, alternativeName: newAltName});   
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

export default router;