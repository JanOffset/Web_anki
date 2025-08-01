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
router.delete('/api/deck/remove', userLoggedIn, async (req, res) => {
    const { 
        body: {
            deckname
        },
        user: {
            id
        }
    } = req;
    const deck = await findDeckByName(deckname, id);
    if (!deck) return res.send({error: "Deck doesnt exist"}).status(400);
    await Deck.findOneAndDelete(deck);
    
    return res.sendStatus(200);
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
    
    if (!newName) {
        return res.status(400).send({ error: 'New name is required' });
    }
    
    
    const deckIndex = decks.findIndex(deck => deck.name === convertNameFromUrl(deckname));
    
    if (deckIndex === -1) {
        return res.status(404).send({ error: 'Deck not found' });
    }
    
    //if new name already exists
    const existingDeck = decks.find(deck => deck.name === newName);
    if (existingDeck) {
        return res.status(400).send({ error: 'Deck name already exists' });
    }
    
    decks[deckIndex].name = newName;
    
    const deckInfo = {
        name: decks[deckIndex].name,
        cardCount: decks[deckIndex].cards ? decks[deckIndex].cards.length : 0,
        id: decks[deckIndex].id
    };
    
    return res.send(deckInfo);
});


export default router;