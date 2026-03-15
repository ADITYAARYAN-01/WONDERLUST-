const express = require('express');
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../MODELS/review.js")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const router = express.Router({ mergeParams: true });
const Listing = require("../MODELS/listing.js");
const {validateReview , isLoggedIn,isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/review.js");

// create review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))


module.exports = router;