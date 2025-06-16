import express from "express";
import routes from './routes/index.mjs'
import cookieParser from "cookie-parser"
import session from "express-session"
import { decks } from "./utils/consts.mjs";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cookieParser("cookieSecret213"));
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
app.use(routes);

app.get('/',
    (req, res) => {
        console.log(req.session);
        console.log(req.sessionID);
        req.session.visited = true;
        res.cookie("rememberme", "1", { expires: new Date(Date.now() + 60000), signed: true})
        res.send("main page");
    }
);

app.post('/api/auth', (req, res) => {
        const { 
            body: {
                deckName,
                password
            }
        } = req;
        const findDeck = decks.find(
            (deck) => deck.deck_name === deckName
        )
        console.log(findDeck);
        if (!findDeck || findDeck.password !== password)
            return res.status(401).send(
            { msg: "BAD_CREDENTIALS"}
        );

        req.session.deck = findDeck;
        return res.status(200).send(findDeck);
    }
);

app.listen(PORT, () => {
        console.log(`listening on ${PORT}`);
    }
);

