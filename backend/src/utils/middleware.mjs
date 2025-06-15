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
    const { params: { deckName } } = req;
    const findDeckByName = decks.findIndex((deck) => deck.deck_name === deckName)
    const parsedName = parseInt(deckName);
    if (!isNaN(parsedName)) return res.sendStatus(400);

    req.findDeckByName = findDeckByName;
    next();
}

export const findCardIndexById = (req, res, next) => {
    const {
        params: { cardId, deckName },
    } = req;
    const parsedId = parseInt(cardId);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findCardIndex = decks.findIndex((deck) => deck.id === parsedId && deck.deck_name === deckName)
    if (findCardIndex === -1) return res.sendStatus(400);
    req.findCardIndex = findCardIndex;
    next();
}