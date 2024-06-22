
require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");


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


// get user profile
app.get("/get-user", authenticateToken, async(req,res) => {
    const { user } = req.user;
    const isUser = await User.findOne({_id: user._id});

    if(!isUser){
        return res.sendStatus(401)
    }

    return res.json({
        user: {fullName: isUser.fullName,
                email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn},
        message: ""
    })
})

// Add note
app.post("/add-note", authenticateToken, async (req,res) =>{
    const {title, content, tags} = req.body;
    const { user } = req.user;
    //const { _id: userId } = req.user;

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
            userId: user._id
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

// Edit notes
app.put("/edit-note/:noteId", authenticateToken, async (req,res) =>{
    const noteId = req.params.noteId
    const {title, content, tags, isPinned} = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note) {
            return res.status(404).json({ error: true, message: "Note not found"})
        }
        
        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message : "note updated successfully"
        })




    }
    catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})


// Get all notes

app.put("/get-all-notes/", authenticateToken, async (req,res) =>{
    const { user } = req.user;

    try{
        const notes = await Note.find({userId: user._id}).sort({ isPinned: - 1 })

        //await notes.save();

        return res.json({
            error: false,
            notes,
            message : "notes retrieved successfully"
        })




    }
    catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})


// delete a note
app.delete("/delete-note/:noteId", authenticateToken, async (req,res) =>{
    const noteId = req.params.noteId
    const { user } = req.user;

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note) {
            return res.status(404).json({ error: true, message: "Note not found"})
        }
        

        await Note.deleteOne({_id:noteId, userId: user._id})
        return res.json({
            error: false,
            note,
            message : "note deleted successfully"
        })




    }
    catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

// update isPinned value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req,res) => {
    const noteId = req.params.noteId
    const {isPinned} = req.body;
    const { user } = req.user;

    if(!isPinned) {
        return res.status(400).json({ error: true, message: "No changes provided"})
    }

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note) {
            return res.status(404).json({ error: true, message: "Note not found"})
        }
        
        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message : "note updated successfully"
        })




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
