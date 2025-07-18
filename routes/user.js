const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users");


// use the documentation of password for the login logout and other fuctional usage and syntax
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), 
    wrapAsync(userController.login));

router.get("/logout", userController.logout);



module.exports = router;



