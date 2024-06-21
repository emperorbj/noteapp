
require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

//mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(config.connectionString)
const User = require("./models/user.model");

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const app = express();

const Note = require("./models/note.model")

app.use(express.json());

app.use(
    cors({
        origin: "*"
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

// Creating an account end point
app.post("/account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full name is required" });
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }




    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exists"
        });
    }

    const newUser = new User({
        fullName,
        email,
        password
    });

    await newUser.save();
    const accessToken = jwt.sign({ user: newUser }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3600m",
    });
    return res.json({
        error: false,
        user: newUser,
        accessToken,
        message: "Registration successful"
    });

    
});

// login into account end point
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const UserInfo = await User.findOne({ email: email });

    if (!UserInfo) {
        return res.json({
            error: true,
            message: "User does not exists"
        });
    }

    if(UserInfo.email == email && UserInfo.password == password) {
        const user = { user: UserInfo};
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: "3600m",
        });
        return res.json({
            error: false,
            message: "Login successful",
            email,
            accessToken,
        })
    }
    else{
        return res.status(400).json({
            error: true,
            message: "Invalid credentials"
        })
    }


})

// Add note
app.post("/add-note", authenticateToken, async (req,res) =>{
    const {title, content, tags} = req.body;
    const { user } = req.user;

    if(!title) {
        return res.status(400).json({ error: true, message: "Title is required"})
    }

    if(!content) {
        return res.status(400).json({ error: true, message: "Content is required"})
    }

    try{

        const note = new Note({
            title,
            content,
            tags: tags || [],
            user: user._id
        });


        await note.save();

        return res.json({
            error: false,
            message: "Note added successfully",
            note
        });


    }
    catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

module.exports = app;
