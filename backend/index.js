require("dotenv").config()

const config = require("./config.json")
const mongoose = require("mongoose")

mongoose.connect(config.connectionString)
const User = require("./models/user.model")

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticate } = require("./utilities");
app.use(express.json());

app.use(
    cors({
        origin: "*"
    })
);

app.get("/", (req,res) => {
    res.json({ data: "hello"})
})

// creating and account
app.post("/create-account",async (req,res) => {
    const { fullName, email, password } = req.body;

    if(!fullName) {
        return res.status(400).json({ error: true, message: "Full name is required" });
    }

    if(!email) {
        return res.status(400).json({ error: true, message: "email is required" });
    }

    if(!password) {
        return res.status(400).json({ error: true, message: "password is required" });
    }

    if(!fullName) {
        return res.status(400).json({ error: true, message: "Full name is required" });
    }
    
    const isUser = await user.findOne({ email: email});

    if(isUser) {
        return res.json({
            error: true,
            message: "User already exists"
        })
    }

    const user = new user({
        fullName,
        email,
        password
    });

    await user.save();
})
app.listen(8000)
module.exports = app;