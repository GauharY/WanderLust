const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review");
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {listingSchema, reviewSchema}=require("../schema");
const Listing = require("../models/listing");

const validateReview=(req, res, next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

// --------------------REVIEWS--------------------
// POST  review route
router.post("/",validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    req.flash("success","New Review Created Successfully!");
    res.redirect(`/listings/${listing._id}`);
}));

// DELETE review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;