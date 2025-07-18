const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isOwner, validateListing} = require("../middleware");



// --------------------LISTINGS--------------------
// index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
}));

// NEW route for new listings
router.get("/new",isLoggedIn, (req,res)=>{
    res.render("listings/new");
});

// SHOW route
router.get("/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate({path: "reviews",populate: {path: "author"} }).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show",{listing});
}));

// CREATE route
// router.post("/listings", async (req,res)=>{
//     const newListing=new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// });
router.post("/",validateListing,isLoggedIn, wrapAsync(async (req, res, next) => {
        const { listing, listingImageUrl } = req.body;
        const newListing = new Listing(listing);
        newListing.image = { url: listingImageUrl, filename: "" }; // manual override
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created Successfully!");
        res.redirect("/listings");
}));

// EDIT route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    
    res.render("listings/edit",{listing});
}));


// UPDATE route
// app.put("/listings/:id", async(req,res)=>{
//     let{id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// });
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync( async (req, res) => {
  const { id } = req.params;
  const { listing, listingImageUrl } = req.body;
  listing.image = { url: listingImageUrl, filename: "" };
  await Listing.findByIdAndUpdate(id, listing);
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
}));



// DELETE route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync( async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
}));

module.exports = router;

