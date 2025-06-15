import {decks} from "./consts.mjs"

export const findDeckIndexById = (req, res, next) => {
    const {
        params: { id },
    } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findDeckIndex = decks.findIndex((deck) => deck.id === parsedId)
    if (findDeckIndex === -1) return res.sendStatus(400);
    req.findDeckIndex = findDeckIndex;
    next();
}

export const findDeckIndexByName = (req, res, next) => {
    const { 
        params: {
            deckName 
        } 
    } = req;
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