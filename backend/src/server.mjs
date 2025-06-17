import express from "express";
import routes from './routes/index.mjs'
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport";
import "./strategies/local-strategy.mjs"

const app = express();
const PORT = process.env.PORT || 3000;

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

app.post("/api/auth", passport.authenticate("local"), (req,res) => {
        res.sendStatus(200);
    }
);

app.post("/api/auth/logout", (req, res) => {
    if (!req.user) return req.sendStatus(401);
    req.logOut((err) => {
        if (err) return res.sendStatus(400);
        res.send(200)
    })
})

app.get("/api/auth/status", (req, res) => {
    console.log("inside /auth/api/status endpoint")
    console.log(req.user)
    console.log(req.session)
    console.log(req.sessionID)
    return req.user ? res.send(req.user): res.sendStatus(401);
    }
)

app.get('/',
    (req, res) => {
        console.log(req.session);
        console.log(req.sessionID);
        req.session.visited = true;
        res.cookie("rememberme", "1", { expires: new Date(Date.now() + 60000), signed: true})
        res.send("main page");
    }
);

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

