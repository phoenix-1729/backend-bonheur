const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    memories: [{
        title: { type: String },
        message: { type: String },
        creator: { type: String },
        tags: [String],
        selectedFile: { type: String },
        likeCount: {
            type: Number,
            default: 0
        },
        visitCount: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: new Date()
        }
    }],
    length: {
        type: Number,
        default: 0
    }
})

//Hashing Password
userSchema.pre('save', async function(next) {
    console.log("Hi ...I am from password hashing");
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});


//Token
userSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        console.log('I am returning token');
        // console.log(token);
        return token;
    } catch (err) {
        console.log(err);
    }
}

//Storing Memories
userSchema.methods.addMemory = async function(creator, title, message, tags, selectedFile) {
    try {
        this.memories = this.memories.concat({ creator, title, message, tags, selectedFile });
        this.length = this.memories.length;
        await this.save();
        console.log(" MEMORY SAVED ");
        return this.memories;
    } catch (err) {
        console.log(err);
    }
}


const User = mongoose.model('Registration', userSchema);

module.exports = User;