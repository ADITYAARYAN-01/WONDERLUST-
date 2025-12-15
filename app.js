const express = require('express');
const mongoose = require('mongoose');
const Listing = require("./MODELS/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} = require("./schema.js");

const port = 8080;
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, "/public")))


app.get("/", (req, res) => {
    res.send("HI I AM ROOT")
})

// app.get("/testListings",async(req,res) =>{
//     let samplelisting = new Listing({
//         title : "NEW HOME",
//         description : "SDDSSDSDDSCSDC",
//         price : 2000,
//         location : "SCDSScs",
//         country:"INDIA"
//     });

//     await samplelisting.save();
//     console.log("SAMPLE WAS SAVED");
//     res.send("successful testing")
// })


app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}))

//New Routes
app.get("/listings/new", async (req, res) => {
    res.render("listings/new");
})

// SHOW ROUTE
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing })
}))

//CREATE ROUTE 
app.post("/listings", wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error) {
        throw new ExpressError(400,result.error);
    }
    let listingnew = new Listing(req.body.listing);
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "SEND A VALID BODY");
    // }
    // if (!listingnew.description) {
    //     throw new ExpressError(400, "SEND A VALID DESCRIPTION");
    // }
    // if (!listingnew.title) {
    //     throw new ExpressError(400, "SEND A VALID TITLE");
    // }
    // if (!listingnew.location) {
    //     throw new ExpressError(400, "SEND A VALID LOCATION");
    // }

    await listingnew.save();
    res.redirect("/listings")
})
);

//EDIT ROUTE
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

//UPDATE ROUTE
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
}))
//DELETE ROUTE

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted_listing = await Listing.findByIdAndDelete(id);
    console.log(deleted_listing)
    res.redirect("/listings");
}))

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page not Found"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "SOMETHING WENT WRONG" } = err;
    res.status(statusCode).render("error.ejs", { message });
    //res.status(statusCode).send(message);
    // res.send("SomeThing went wrong")
})

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

app.listen(port, () => {
    console.log(`SERVER IS LISTENING ON PORT ${port}`)
})