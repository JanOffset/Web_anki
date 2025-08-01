import passport from "passport"
import { Router } from "express"
import "../strategies/local-strategy.mjs"

const router = Router();

router.post("/api/auth", passport.authenticate("local"), (req,res) => {
        res.sendStatus(200);
    }
);

router.post("/api/auth/logout", (req, res) => {
    if (!req.user) return req.sendStatus(401);
    req.logOut((err) => {
        if (err) return res.sendStatus(400);
        res.send(200)
    })
})

router.get("/api/auth/status", (req, res) => {
    console.log("inside /auth/api/status endpoint")
    console.log(req.user)
    console.log(req.session)
    console.log(req.sessionID)
    const { username, displayname } = req.user;
    return req.user ? res.send({username, displayname}): res.sendStatus(401);
    }
)

router.get('/',
    (req, res) => {
        console.log(req.session);
        console.log(req.sessionID);
        req.session.visited = true;
        res.cookie("rememberme", "1", { expires: new Date(Date.now() + 60000), signed: true})
        res.send("main page");
    }
);

export default router
