import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { userValidationSchema } from '../utils/validationSchemas.mjs'
import { User } from "../mongoose/schemas/user.mjs"
import { userLoggedIn } from "../utils/middleware.mjs";
const router = Router();

router.post('/api/users', checkSchema(userValidationSchema), async (req, res) => {
    const result = validationResult(req);
    const data = matchedData(req)
    const newUser = new User(data);

    if (!result.isEmpty()) return res.send({ error: result.array() }); 

    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});

//show user profile
router.get('/api/users/profile', userLoggedIn, (req, res) => {
    const {username, displayname} = req.user; 
    return res.status(200).send({username, displayname});
});

//alternative to my profile
router.get('/api/users/me', userLoggedIn, (req, res) => {
    const {username, displayname} = req.user; 
    return res.status(200).send({username, displayname});
});

router.patch('/api/users/edit/password', userLoggedIn, async (req, res) => {
    const { password } = req.user;
    const { current_password, new_password } = req.body;
    const new_pass = {};
    
    if (current_password !== password) return res.sendStatus(401);  
    new_pass.entry = new_password;
    
    try { 
        await User.findByIdAndUpdate(req.user.id, {password: new_pass.entry});
        res.status(200).send({message: 'Password changed' });   
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

//edit username or displayname
router.patch('/api/users/edit', userLoggedIn, async (req, res) => {
    const { displayname, username } = req.user;
    const { new_displayname, new_username } = req.body;
    
    const new_data = { displayname, username };
    // new_data.displayname = new_displayname !== undefined ? new_displayname : displayname;
    // new_data.username = new_username !== undefined ? new_username : username;
    if (new_displayname !== undefined) new_data.displayname = new_displayname;
    if (new_username !== undefined) new_data.username = new_username;

    const updateUser = await User.findByIdAndUpdate(req.user.id, {username: new_data.username, displayname: new_data.displayname}, {new: true});
    res.status(200).send(updateUser);
});

//show different user 
//router.get('/api/users/differentUser');

export default router;