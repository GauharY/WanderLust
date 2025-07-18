const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware");
const Listing = require("../models/listing");



// --------------------REVIEWS--------------------
// POST  review route
router.post("/", validateReview, isLoggedIn, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    
    req.flash("success","New Review Created Successfully!");
    res.redirect(`/listings/${listing._id}`);
}));

// DELETE review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;