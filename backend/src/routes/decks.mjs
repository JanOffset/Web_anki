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
        query: {
            deckname
        },
        user: {
            id
        }
    } = req;
    
    try {
        
        if (deckname) { 
            const deck = await Deck.findOne(deckname, id) 

            if (deck) {
                const deckInfo = {
                    name: deck.deckname,
                    alternative: deck.alternativeName,
                    cardCount: deck.cardIds ? deck.cardIds.length : 0,
                    
                };
                return res.send(deckInfo);
            }
        }
        const dbDecks = await Deck.find();
        const allDecks = dbDecks.map(deck => ({
        name: deck.deckname,
        alternative: deck.alternativeName,
        cardCount: deck.cardIds ? deck.cardIds.length : 0,
        }));
        
        return res.send(allDecks);
    } catch (err) {
        console.log(err);
        res.status(400).send({error: "Error Invalid Get request"});
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
<<<<<<< HEAD
    try {
        const deck = await findDeckByName(deckname, id);        
        if (!deck) return res.sendStatus(400);
        await Deck.findOneAndDelete({userId: id, deckname: deckname});
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400)
=======

    try {    
        const deck = await findDeckByName(deckname, id);
        if (!deck) return res.send({error: "Deck doesnt exist"}).status(400);
        
        await Deck.findOneAndDelete(deck);
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
>>>>>>> 3ae2517dea8f354cda1662094b9c320c32ae43b9
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
    
<<<<<<< HEAD
    if (!deckname) return res.status(400).send({error: 'Deckname is required'})
    if (!newName) return res.status(400).send({ error: 'New name is required' });
    
    try { 
        await Deck.findOneAndUpdate(id, {deckname: convertNameFromUrl(newName), alternativeName: newAltName ? newAltName : deckname});
        return res.send({deckname: newName, alternativeName: newAltName});   
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
=======
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
        return res.status(400).send({error: "Invalid Deck Request"})    
>>>>>>> 3ae2517dea8f354cda1662094b9c320c32ae43b9
    }
});

export default router;