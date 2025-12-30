const express = require("express");
const mongoose = require('mongoose');
const Listing = require("../MODELS/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const router = express.Router();

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

//INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}))

//New Routes
router.get("/new", async (req, res) => {
    res.render("listings/new");
})

// SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","listing does not exist");
        return res.redirect("/listings")
    }
    res.render("listings/show", { listing })
}))

//Create Route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    let listingnew = new Listing(req.body.listing);
    await listingnew.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings")
})
);

//EDIT ROUTE
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing does not exist");
        return res.redirect("/listings")
    } 
    res.render("listings/edit", { listing });
}));

//UPDATE ROUTE
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`)
}))
//DELETE ROUTE

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted_listing = await Listing.findByIdAndDelete(id);
    console.log(deleted_listing)
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}))



module.exports = router;