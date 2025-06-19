import { Router } from "express";
import { query, checkSchema, matchedData, validationResult, body } from "express-validator";
import { checkValidationSchemas, userValidationSchema} from '../utils/validationSchemas.mjs'
import {decks} from '../utils/consts.mjs'
import {findDeckIndexById} from "../utils/middleware.mjs"
import { User } from "../mongoose/schemas/user.mjs"
const router = Router();

// router.get("/api/decks/",
//     checkSchema(checkQuerryValidationSchemas), 
//     (req, res) => {
//         const result = validationResult(req);
//         const data = matchedData(req)

//         if (data.filter && data.value) return res.send(decks.filter(
//             (deck) => deck[data.filter].includes(data.value))
//         );

//         return res.send(decks);
//     }
// );

// router.get('/api/decks/:id',
//     findDeckIndexById,
//     (req, res) => {
//         const {
//             findDeckIndex,
//         } = req;
//         const findDeck = decks[findDeckIndex];

//         if (!findDeck) return res.sendStatus(404);
//         console.log(req.headers.cookie)
//         console.log(req.signedCookies);
//         console.log(req.signedCookies.rememberme)
//         if (req.signedCookies.rememberme && req.signedCookies.rememberme === "1") {
//             return res.send(findDeck);       
//         }

//         return res.status(403).send({ msg: "you need the right cookie" })
//     }
// );

// router.put('/api/decks/:id', findDeckIndexById, (req, res) => {
    
//     const { 
//         findDeckIndex,
//         body
//     } = req;
    
//     decks[findDeckIndex] = { id: decks[findDeckIndex].id, ...body};
//     return res.sendStatus(200);
// })

// router.patch('/api/decks/:id', findDeckIndexById, (req, res) => {
//     const { 
//         findDeckIndex,
//         body
//     } = req;
    
//     decks[findDeckIndex] = { ...decks[findDeckIndex], ...body};
//     return res.sendStatus(200);
// });

// router.delete('/api/decks/:id', findDeckIndexById, (req, res) => {
//     const { findDeckIndex } = req;
//     decks.splice(findDeckIndex, 1);
//     return res.sendStatus(200);
// });

router.post('/api/users', checkSchema(userValidationSchema), async (req, res) => {
    const result = validationResult(req);
    const data = matchedData(req)
    const newUser = new User(data);

    if (!result) return res.send({ msg: result.array() }); 

    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

export default router;