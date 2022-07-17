const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Createupdatereaduser = require("./src/createupdateread");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");

require("dotenv").config();

const io = new Server(server);

io.on('connection',(socket)=> {
    socket.on('messageUpdate', (msg) => {
        socket.broadcast.emit('updateYourTable',"you have to update your users table because it may have changed");
      });
});

app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public','program1')));
app.use(express.static(path.join(__dirname,'public','program1','index.html')));
app.use(express.static(path.join(__dirname,'public','program1','style.css')));
app.use(express.static(path.join(__dirname,'public','program1','app.js')));
app.use(express.static(path.join(__dirname,'public','program2')));
app.use(express.static(path.join(__dirname,'public','program2','index.html')));
app.use(express.static(path.join(__dirname,'public','program2','app.css')));
app.use(express.static(path.join(__dirname,'public','program2','app2.js')));

app.get('/',(req,res)=> {
    res.sendFile(path.join(__dirname,'public','program1','index.html'));
});

app.get('/name/:name/points/:points', (req,res)=> {
    const {name, points} = req.params;
    try {
        new Createupdatereaduser().createOrUpdateUser(name, Number(points)).then(d=> {
            res.status(200).json({message: "user recorded"});
        }).catch(e=>new Error(e));
    } catch (error) {
       console.log("Error"+error.message); 
    }
});

app.get('/users', (req,res)=> {
    
    try {
        new Createupdatereaduser().getUsers().then(d=> {
            res.status(200).json(d);
        }).catch(e=>new Error(e));
    } catch (error) {
       console.log("Error"+error.message); 
    }
});

app.get('/one',(req,res)=> {
    console.log("calling get page one");
    res.sendFile(path.join(__dirname,'public','program1','index.html'));
});

app.get('/two',(req,res)=> {
    console.log("calling get page two");
    res.sendFile(path.join(__dirname,'public','program2','index.html'));
});

const start = async () => {
    await mongoose.connect(process.env.MONGO_URI).then(()=> {
        server.listen(process.env.PORT, ()=> {
            console.log("Server running on http://localhost:"+process.env.PORT);
        });
    });
}

start();

module.exports = start;