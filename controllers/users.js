const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup");
};

module.exports.signup = async(req, res)=>{
    try {
        let{username,password,email} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings"); 
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm =  (req, res)=>{
    res.render("users/login");
};

module.exports.login = async (req, res)=>{
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; //is the middleware is triggered but redirectUrl is empty the it will give error so in or we added listings pade redirect.
    res.redirect(redirectUrl);
};

module.exports.logout =  (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out.");
        res.redirect("/listings");
    });
};