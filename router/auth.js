// import { getPosts, getPost, createPost, updatePost, likePost, deletePost } from '../controllers/posts.js';
// const express = require('express');

const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

require('../db/conn');

const User = require("../model/userSchema");
const authenticate = require("../middleware/authentication");

//Example Main Route
// router.get('/', (req, res) => {
//     res.send("Hello World 2");
// });

// Registration Route
router.post('/register', async(req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Field not filled" });
    }
    // console.log(req.body);
    // res.json({ message: req.body });
    //res.send("register ka content le liya");
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "Email Already Exist" });
        }

        const user = new User({ name: name, email: email, phone: phone, work: work, password: password, cpassword: cpassword });

        //password hashing

        const userExistIN = await user.save();
        if (userExistIN) {
            res.status(201).json({ message: "user registration succefull" });
        } else { res.status(500).json({ error: "Failed to register" }); }
    } catch (err) {
        console.log(err);
    }
});


// LOGIN Route
router.post('/signin', async(req, res) => {
    // console.log(req.body);
    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ eroor: "Fill the Data" })
        }
        // console.log(email);
        const userLogin = await User.findOne({ email: email });

        // console.log(userLogin);
        // console.log(userLogin.password);
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            token = await userLogin.generateAuthToken();
            console.log("received token");
            // console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 2589200000),
                httpOnly: false
            });

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credentials" });
                console.log("Invalid Login");

            } else {
                res.json({ message: "User Sign IN Successfully" });
                console.log("Successfull Login");

            }
        } else {
            res.status(400).json({ error: "Invalid Credentials" });
        }
    } catch (err) {
        console.log(err);
    }
})

//About Route later will be used to show memories
router.get('/about', authenticate, (req, res) => {
    // console.log("IN ABOUT");
    res.send(req.rootUser);
    // console.log(req.rootUser);
});

router.get('/getMemories', authenticate, (req, res) => {
    res.send(req.memories);
    // console.log(req.memories);
    // const obj = JSON.parse(req.memories);
    // res.send(obj.length);
});

router.post('/about1', authenticate, async(req, res) => {
    try {
        const { creator, title, message, tags, selectedFile } = req.body;
        if (!creator, !title, !message, !tags, !selectedFile) {
            console.log("Fill the post");
            return res.json({ error: "Fille the post" });
        }
        const isUser = await User.findOne({ _id: req.userID });
        if (isUser) {
            const userMemory = await isUser.addMemory(creator, title, message, tags, selectedFile);

            // await userMemory.save();
            res.status(201).json({ message: "Posted Memory Successfully" })
        }

    } catch (error) {
        console.log(error);
    }
});


router.get('/logout', (req, res) => {
    // console.log("IN Logout");
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).send('User has logged out');
});



module.exports = router;