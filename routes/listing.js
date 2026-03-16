const express = require("express");
const mongoose = require('mongoose');
const Listing = require("../MODELS/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const router = express.Router();
const listingController = require("../controllers/listing.js");

// using router.route() method because it  allows you to create a single chain for a specific path and then attach different HTTP methods (GET, POST, PUT, DELETE) to it.


router.route("/")

    //INDEX ROUTE
    .get(wrapAsync(listingController.index))

    //Create Route
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));


//New Routes
router.get("/new", isLoggedIn, listingController.renderNewForm)


router.route("/:id")

    //show route
    .get(wrapAsync(listingController.showListing))

    //UPDATE ROUTE
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))

    //delete route 
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))




//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// //INDEX ROUTE
// router.get("/", wrapAsync(listingController.index));


// // SHOW ROUTE
// router.get("/:id", wrapAsync(listingController.showListing))

// //Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));


//UPDATE ROUTE
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
// DELETE ROUTE
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))


module.exports = router;