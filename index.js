
const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const cors=require('cors');
const port=8000;
const router=require('./routes/index.js');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
app.use(bodyParser.json({limit: "30mb",extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb",extended: true}));
app.use(cors());
app.use('/',router);

const db=require('./config/mongoose');
const { use } = require('bcrypt/promises.js');
console.log('hi');
const server=app.listen(port,function(err){
    if(err){
        console.log('Error: ',err);
    }
    console.log('server is up and running on port ',port);
});
const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"https://65830be0818c4226c0286146--sunny-clafoutis-25b61c.netlify.app/"
    }
});
io.on("connection",(socket)=>{
    console.log("connected to socket.io",socket.id);
    socket.on("setup",(userData)=>{
        console.log(userData?.name,": ",userData?._id);
        socket.emit('connected');

    });
    socket.on("join rooms",(chatList)=>{
        console.log(chatList);
        for(let i=0;i<chatList.length;i++){
            socket.join(chatList[i]._id);
        }
    });
    socket.on("new message",(newMessage)=>{
        // console.log(newMessage,'hiii');
        // io.emit("message recieved",newMessage);
        var chat=newMessage?.chat;
        // console.log(chat,newMessage);
        if(!newMessage?.chat?.users){
            console.log('chat.users is undefined');
            return;
        }else{
            io.to(chat._id).emit("message recieved", newMessage);
        }
        
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });

})


