const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isOwner, validateListing} = require("../middleware");

const listingController = require("../controllers/listings");


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(validateListing,isLoggedIn, wrapAsync(listingController.createListing));

// NEW route for new listings
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync( listingController.destroyListing));

// EDIT route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;

