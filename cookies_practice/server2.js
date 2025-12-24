// for learning sessions 
const express = require('express');
const app = express();
const port = 3000;
const cookieparser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
}
app.use(
    session(sessionOptions)
);
app.use(flash())

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    // res.send(name);
    req.flash("success", "USER REGISTERED SUCCESSFULLY")
    res.redirect("/hello")
});

app.get("/hello", (req, res) => {
    console.log(req.flash('success'));
    res.render("page.ejs", { name: req.session.name, msg: req.flash("success") })
})

app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    }
    else {
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



