import express from "express";
import routes from './routes/index.mjs'
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport";
import 'dotenv/config'
import "./strategies/local-strategy.mjs"
import mongoose from "mongoose"
// import runDbMigration from "../migration/runDbMigration.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/Web_anki')
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log(err))
// await runDbMigration();
// orm oriented
app.use(
    session({
        secret: "sessionSecret123",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60
        }
    })
);

app.use(passport.initialize())
app.use(passport.session())

app.use(express.json());
app.use(cookieParser("cookieSecret213"));

app.use(routes);

// app.post('/api/auth', (req, res) => {
//         const { 
//             body: {
//                 deckName,
//                 password
//             }
//         } = req;
//         const findDeck = decks.find(
//             (deck) => deck.deck_name === deckName
//         )
//         console.log(findDeck);
//         if (!findDeck || findDeck.password !== password)
//             return res.status(401).send(
//             { msg: "BAD_CREDENTIALS"}
//         );

//         req.session.deck = findDeck;
//         return res.status(200).send(findDeck);
//     }
// );

// app.get('/api/auth/status', (req, res) => {
//         req.sessionStore.get(req.sessionID, (err, session) =>{
//                 console.log(session)
//             }
//         );

//         return req.session.deck ? res.status(200).send(req.session.deck)
//          : res.status(401).send({ msg: "User not authenticated" });
//     }
// );

// app.post('api/deckManager', (req, res) => {
//         if (!req.session.deck) return res.sendStatus(401);
//         const { body: item } = req;
//         const { cart } = req.session;
//         if (cart) {
//             cart.push(item)
//         } else {
//             req.session.cart = [item];
//         }
//         return res.sendStatus(201).send(item);
//     }
// );

// app.get('api/cart', (req,res) => {
//         if (!req.session.deck) return res.sendStatus(401);
//         return res.send(req.session.cart ?? []);
//     }
// );

app.listen(PORT, () => {
        console.log(`listening on ${PORT}`);
    }
);

