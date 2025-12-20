const express = require('express');
const app = express();
const port = 3000;
const cookieparser = require("cookie-parser")

app.use(cookieparser("secretcode"));

app.get("/new", (req, res) => {
    res.cookie("GREET" , "HELLO");  
    res.send("THIS IS ROOT")
})

app.get("/" ,(req,res) =>{
    console.dir(req.cookies);
    res.send("HI , I am root")
})

app.get("/getsignedcookie" ,(req,res) =>{
    res.cookie("MADE-IN", "India",{signed:true});
    res.send("SIGNED COOKIE SEND")
})
//to verify
app.get("/verify" ,(req,res) =>{
    // console.log(req.cookies);
    console.log(req.signedCookies)
    res.send("VERIFIED")
})


app.listen(port, () => {
    console.log(`server is listening on ${port}`)
}) 