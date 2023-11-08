const express=require('express');
const app=express();
const http=require('http');

const server=http.createServer(app);

//initialise a new instance of socket.io
const socketIO=require('socket.io')
let io=socketIO(server);

const port=process.env.PORT||3000;

server.listen(port,()=>
{
    console.log('Server is listening');
});

//socket connection (event) with client
io.on('connection',(socket)=>
{
    //event handler for when a client joins a room

    socket.on('join',(data)=>{
        //client sends a join event with the room name(data.room)
        //server makes the client join the room
        socket.join(data.room);

        //broadcast a message who joined
        socket.broadcast.to(data.room).emit('User Joined');
    });

    //event handler for receiving messages from clients

    socket.on('message',(data)=>{
        //client sends a message event with user info ie user and message
        //broadcast the received message to all the clients in the specific room
        io.in(data.room).emit('New Message',{user:data.user,message:data.message});
    });
});

