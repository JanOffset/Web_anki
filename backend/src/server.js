import express from "express";
import routes from './routes/index.mjs'
import cookieParser from "cookie-parser"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.get('/',
    (req, res) => {
    res.cookie("rememberme", 1, { expires: new Date(Date.now() + 60000 * 60), httpOnly: true})
    res.send("main page");
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

