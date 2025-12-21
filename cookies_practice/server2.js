// for learning sessions 
const express = require('express');
const app = express();
const port = 3000;
const cookieparser = require("cookie-parser")
const session = require("express-session")

app.use(
    session({
        secret: "mysupersecretstring",
        resave: false,
        saveUninitialized: true,
    })
);

app.get("/reqcount", (req, res) => {
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count = 1;
    }
    res.send(`You have sent a request  ${req.session.count} times`)
})

app.get("/test", (req, res) => {
    res.send("TEST SUCCESSFUL")
})

app.listen(port, () => {
    console.log(`server is listening on ${port}`)
}) 