"use strict";
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var usernames=[];
server.listen(process.env.PORT || 3000);
app.use("/", express.static(__dirname + "/public"));
app.get("/", function (req, res) {
    res.sendfile(__dirname + "/index.html");
});
io.sockets.on("connection", function (socket) {
    socket.on('new user',function(data,callback){
        if(usernames.indexOf(data)!=-1){
            callback(false);
        }else{
            callback(true);
            socket.username=data;
            usernames.push(data);
            updateUsernames();
        }
    });
    //update usernames
    function updateUsernames(data){
        io.sockets.emit('usernames',usernames);
    }
    //send Messsage
    socket.on('send message', function (data) {
        io.sockets.emit('new message', {
            msg: data,
            user:socket.username
        });
    });
    //disconnect
    socket.on('disconnect',function(data){
        if(!socket.username) return;
        usernames.splice(usernames.indexOf(socket.username),1);
        updateUsernames();
    });
});