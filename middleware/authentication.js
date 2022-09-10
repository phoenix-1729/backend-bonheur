const jwt = require('jsonwebtoken');
const User = require("../model/userSchema");
const cookieParser = require('cookie-parser');

const Authenticate = async(req, res, next) => {
    try {
        // console.log(req.cookies);
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) { throw new Error('User not found') }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        req.memories = rootUser.memories;
        // req.memoriesl = rootUser.memories.length;

        next();

    } catch (er) {
        res.status(401).send('UNAUTHORISED : No Token provided to me');
        console.log(er);
    }
}

module.exports = Authenticate;