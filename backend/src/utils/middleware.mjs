import {decks} from "./consts.mjs"
import { Deck } from "../mongoose/schemas/deck.mjs";

export const findDeckIndexById = (req, res, next) => {
    const {
        id 
    } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findDeckIndex = decks.findIndex((deck) => deck.id === parsedId)
    if (findDeckIndex === -1) return res.sendStatus(400);
    req.findDeckIndex = findDeckIndex;
    next();
}

export const convertNameForUrl = (name) => name.replace(/\s+/g, '_');
export const convertNameFromUrl = (urlName) => urlName.replace(/_/g, ' ');

export const findDeckByName = async (deckName, loggedId) => {
    const actualName = convertNameFromUrl(deckName);
    return await Deck.findOne({ deckname: actualName, userId: loggedId });
};

export const userLoggedIn = (req, res, next) => {
    console.log("request user exist:", !!req.user);
    const {
        user
    } = req;
    if (!user) return res.sendStatus(401);
    next();
} 

export const findDeckIndexByName = (req, res, next) => {
    const { 
        deckName 
    } = req.params;
    const findDeckByName = decks.findIndex((deck) => deck.deck_name === deckName)
    const parsedName = parseInt(deckName);
    if (!isNaN(parsedName)) return res.sendStatus(400);

    req.findDeckByName = findDeckByName;
    next();
}

export const findCardIndexById = (req, res, next) => {
    const {
        params: {
            cardId
        },
        findDeckByName
    } = req;
    const parsedId = parseInt(cardId);
    
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findCard = decks[findDeckByName].cards;
    
    if (!findCard) return res.sendStatus(400);
    const indexOfCard = findCard.findIndex((card) => card.card_id === parsedId);
    
    if (indexOfCard === -1) return res.sendStatus(404);
    req.indexOfCard = indexOfCard;
    next();
}