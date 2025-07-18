const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware");
const Listing = require("../models/listing");

const reviewController = require("../controllers/reviews");


// POST  review route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

// DELETE review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;