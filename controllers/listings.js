// all the callbacks of wrapAsync of our listings.

const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new");
};

module.exports.showListing = async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate({path: "reviews",populate: {path: "author"} }).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show",{listing});
};

module.exports.createListing = async (req, res, next) => {
        const { listing, listingImageUrl } = req.body;
        const newListing = new Listing(listing);
        newListing.image = { url: listingImageUrl, filename: "" }; // manual override
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created Successfully!");
        res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    
    res.render("listings/edit",{listing});
};

module.exports.updateListing =  async (req, res) => {
  const { id } = req.params;
  const { listing, listingImageUrl } = req.body;
  listing.image = { url: listingImageUrl, filename: "" };
  await Listing.findByIdAndUpdate(id, listing);
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};