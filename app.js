const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({mergeParams:true})
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./MODELS/user.js");


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
    secret: "Mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    // setting expiry date 
    cookie: {
        // 1 week in millisecond = 7 * 24 * 60 * 60 * 1000
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}

app.use( 
    session(sessionOptions)
)
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


app.get("/demouser" , async(req,res) =>{
    let fakeuser = new User({
        email:"bandar123@gmail.com",
        username : "Delta-Student"
    })
   let registeredUser = await User.register(fakeuser,"helloworld")
   res.send(registeredUser)
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter);


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
//





































