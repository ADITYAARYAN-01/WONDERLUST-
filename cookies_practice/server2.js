// for learning sessions 
const express = require('express');
const app = express();
const port = 3000;
const cookieparser = require("cookie-parser")
const session = require("express-session")

app.use(session({secret: "mysupersecretstring"}));
app.get("/test",(req,res)=>{
    res.send("TEST SUCCESSFUL")
})

app.listen(port, () => {
    console.log(`server is listening on ${port}`)
}) 