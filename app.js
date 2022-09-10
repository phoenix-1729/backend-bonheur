// const postRoutes = require('./router/posts.js');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();

dotenv.config({ path: './config.env' });

require('./db/conn.js');

//const User = require('./model/userSchema');
app.use(express.json());
app.use(cookieParser());
// var cors = require('cors');
// app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://ecstatic-shannon-2f5afa.netlify.app");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(require('./router/auth.js'));
// app.use('/posts', postRoutes);

const PORT = process.env.PORT || 5000;

const middleware = (req, res, next) => {
    console.log("In middle ware");
    next();
}

app.get('/contact', (req, res) => {
    console.log("IN Contact");
    res.send("Hello World from contact");
});


// app.get('/signin', (req, res) => {
//     console.log("IN SIngin");
//     res.send("Hello World from signin");
// });
// app.get('/signup', (req, res) => {
//     console.log("IN SignUp");
//     res.send("Hello World");
// });

// if (process.env.NODE_ENV == "production") {
//     app.use(express.static("client/build"));
// }

app.listen(PORT, () => {
    console.log("hello from server");
    console.log(PORT);
});