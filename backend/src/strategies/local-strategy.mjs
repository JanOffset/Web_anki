import passport from "passport";
import { Strategy } from 'passport-local'
import { decks } from "../utils/consts.mjs";

passport.serializeUser((deck, done) => {
        console.log("inside serialize user")
        console.log("Serialize User ID " + deck.id)
        console.log(deck)
        
        done(null, deck.id)
    }
)

passport.deserializeUser((id, done) => {
    console.log("inside user deserialization")    
    console.log("Deserialize User ID")
    const parsedId = parseInt(id)
        try {
            const findDeck = decks.find((deck) => deck.id === parsedId);
            if (!findDeck) throw new Error("Deck not found")
                done(null, findDeck)
        } catch (err) {
            done(err, null)
        }
    }
)

export default passport.use(
    new Strategy({ usernameField: "deckName"}, (username, password, done) => {
        console.log(`deck: ${username}`);
        console.log(`password: ${password}`)
        try {
            const findDeck = decks.find((deck) => deck.deck_name === username);
            if (!findDeck) throw new Error("deck not found");
            if (findDeck.password !== password) throw new Error("invalid credentials")
            done(null, findDeck);
        } catch (err) {
            done(err, null);
        }
    })
);
