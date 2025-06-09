const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync")
const Review = require("../models/review");
const Listing = require("../models/listing");
const { validateReview, isLoggedIn, isReviewAuthor} = require("../routes/middleware.js");
const reviewsController = require("../controller/reviews.js");
// Reviews - Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));

// delete review 
router.delete("/:reviewId" , isLoggedIn, isReviewAuthor,  wrapAsync(reviewsController.destroyReview));

module.exports = router;
