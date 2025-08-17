import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    answer: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    deckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deck',
        required: true
    },
    userId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    difficulty: {
        type: mongoose.Schema.Types.Number,
        default: 0
    },
    lastReviewed: {
        type: mongoose.Schema.Types.Date
    },
    nextReview: {
        type: mongoose.Schema.Types.Date
    }
});

export const Card = mongoose.model("Card", CardSchema);