import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { deckValidationSchemas } from '../utils/validationSchemas.mjs'
import { Deck } from "../mongoose/schemas/deck.mjs"; 
import { findDeckByName } from "../utils/middleware.mjs";
import { userLoggedIn } from "../utils/middleware.mjs";

const router = Router();

router.get('/api/deck/all', async (req, res) => {
  try {
    const decks = await Deck.find(); // fetch all decks from all users
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching decks' });
  }
});

//display deck by name, or all decks if not found
router.get('/api/deck', userLoggedIn, async (req, res) => {
    const { 
        query: {
            deckname
        },
        user: {
            id
        }
    } = req;
    
    try {
        
        if (deckname) { 
            const deck = await Deck.findOne({deckname: deckname, userId: id}) 

            if (deck) {
                const deckInfo = {
                    name: deck.deckname,
                    alternative: deck.alternativeName,
                    cardCount: deck.cardIds ? deck.cardIds.length : 0,
                    
                };
                return res.send(deckInfo);
            }
        }
        const dbDecks = await Deck.find({userId: id});
        const allDecks = dbDecks.map(deck => ({
        name: deck.deckname,
        alternative: deck.alternativeName,
        cardCount: deck.cardIds ? deck.cardIds.length : 0,
        }));
        
        return res.send(allDecks);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
    
    //if deck not found return all decks
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
        if (!deck) return res.status(400).send({error: "Deck doesnt exist"});
        
        await Deck.findOneAndDelete({deckname: deckname, userId: id});
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
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
    
    try {
        
        if (!newName) {
            return res.status(400).send({ error: 'New name is required' });
        }
        
        const editDeck = await Deck.findOne({deckname: deckname, userId: id});

        if (!editDeck) return res.status(400).send({error: "Deck not found"})
        
        //if new name already exists
        const NameAlreadyExist = await Deck.findOne({deckname: newName, userId: id});
        if (NameAlreadyExist) {
            return res.status(400).send({ error: 'Deck name already exists' });
        }
        
        editDeck.deckname = newName;
        if (newAltName !== undefined) {
            editDeck.alternativeName = newAltName
        }

        await editDeck.save();

        const deckInfo = {
            name: editDeck.deckname,
            altName: editDeck.alternativeName,
            cardCount: editDeck.cardIds ? editDeck.cardIds.length : 0,
            id: editDeck.id
        };
        
        return res.send(deckInfo);   
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);   
    }
});

export default router;