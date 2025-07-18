const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema");

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; //here we are saving original url in redirect url. 
        // suppose i am not logged in and i want to edit some listing so it will show me to get login and the redirect me on the listing page.
        // so to make things feasible for the user we will be landing up to the orignal url which we want to edit that particular listing url will contain the listing id.
        // but when we login successfully our passport will renew and will delete the redirectUrl, so now we will save this in our locals.
        
        req.flash("error", "You must logged in to do the changes!");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
// for now our this redirecting functionality to that particular url is not working but on hardcore url like we have given /listings in or so listings is working.


module.exports.isOwner =async (req, res, next) => {
    const { id } = req.params;
    // const { listing, listingImageUrl } = req.body;
    // listing.image = { url: listingImageUrl, filename: "" };
    let listingRet = await Listing.findById(id);
    if(!listingRet.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


module.exports.validateReview=(req, res, next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


module.exports.isReviewAuthor =async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "This review was not created by you!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
