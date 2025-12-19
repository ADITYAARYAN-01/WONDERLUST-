const express = require('express');
const mongoose = require('mongoose');
const Listing = require("./MODELS/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./MODELS/review.js")
const listings = require("./routes/listing.js")


const port = 8080;
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, "/public")))


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




const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

app.get("/", (req, res) => {
    res.send("HI I AM ROOT")
})



app.use("/listings", listings);


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




//review post 
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    // console.log("New Review Saved");
    // res.send("New Review Saved")

    res.redirect(`/listings/${listing._id}`);
}))

//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/listings/${id}`)

}))


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "SOMETHING WENT WRONG" } = err;
    res.status(statusCode).render("error.ejs", { message });
    //res.status(statusCode).send(message);
    // res.send("SomeThing went wrong")
})

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page not Found"))
})

app.listen(port, () => {
    console.log(`SERVER IS LISTENING ON PORT ${port}`)
})