const express = require('express');
const mongoose = require('mongoose');
const port = 8080;
const app = express();

app.get("/",(req,res)=>{
    res.send("HI I AM ROOT")
})


app.listen(port, () =>{
    console.log(`SERVER IS LISTENING ON PORT ${port}`)
})