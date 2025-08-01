import mongoose from "mongoose";

const DeckSchema = new mongoose.Schema({
    deckname : {
        type: mongoose.Schema.Types.String,
        required: true
    },
    alternativeName : {
        type: mongoose.Schema.Types.String
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    cardIds: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card'
        }
    ],
});

export const Deck = mongoose.model("Deck", DeckSchema)