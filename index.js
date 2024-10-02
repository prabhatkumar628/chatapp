const express = require("express")
const socketio = require("socket.io")
const http = require("http")
const app = express()
require("dotenv").config({
    path: "./env"
})

const server = http.createServer(app)

const io = socketio(server,{
    cors:{
        origin: "*",
    }
})

const users = {}
app.use(express.static("dist"))
app.get("/users", (req, res)=>{
    res.json(users)
})

io.on("connection", (socket)=>{
    socket.on("joined", (name)=>{
        if(name==""||name=="null"||name==null){}
        else{
            users[socket.id] = name
            socket.broadcast.emit("new-user-joined", name)
            console.log(name)
        }
    })

    socket.on("send", (message)=>{
        socket.broadcast.emit("receive", {
            name:users[socket.id], message:message
        })
    })

    socket.on("disconnect", ()=>{
        if(users[socket.id]==""|| users[socket.id]=="null"||users[socket.id]==null){}
        else{
            socket.broadcast.emit("left", users[socket.id])
            delete users[socket.id]
        }
    })
})

const port = process.env.PORT || 8000

server.listen(port, ()=>{
    console.log(`server is runninng on http://localhost:${port}`)
})