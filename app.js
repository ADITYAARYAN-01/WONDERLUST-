const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const listings = require("./routes/listing.js")
const review = require("./routes/review.js")
const session = require("express-session")


const port = 8080;
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, "/public")))

const sessionOptions = {
    secret:"Mysupersecretcode",
    resave:false,
    saveUninitialized : true,
}

app.use(
    session(sessionOptions)
)

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/WonderLustMain');
}
main()
    .then(c => {
        console.log("Connected Successfully");
    })
    .catch((err) => {
        console.log(err);
    })


app.get("/", (req, res) => {
    res.send("HI I AM ROOT")
})


app.use("/listings", listings);
app.use("/listings/:id/reviews", review)


app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page not Found"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "SOMETHING WENT WRONG" } = err;
    res.status(statusCode).render("error.ejs", { message });
})


app.listen(port, () => {
    console.log(`SERVER IS LISTENING ON PORT ${port}`)
})