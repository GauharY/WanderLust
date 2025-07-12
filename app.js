const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const {listingSchema}=require("./schema");

const mongoUrl="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongoUrl);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi I am root");
});

const validateListing=(req, res, next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

// index route
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
}));

// new route for new listings
app.get("/listings/new", (req,res)=>{
    res.render("listings/new");
});

// CREATE route
// app.post("/listings", async (req,res)=>{
//     const newListing=new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// });
app.post("/listings",validateListing, wrapAsync(async (req, res, next) => {
        const { listing, listingImageUrl } = req.body;
        const newListing = new Listing(listing);
        newListing.image = { url: listingImageUrl, filename: "" }; // manual override
        await newListing.save();
        res.redirect("/listings");
}));

// EDIT route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
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
app.put("/listings/:id", validateListing, wrapAsync( async (req, res) => {
  const { id } = req.params;
  const { listing, listingImageUrl } = req.body;
  listing.image = { url: listingImageUrl, filename: "" };
  await Listing.findByIdAndUpdate(id, listing);
  res.redirect(`/listings/${id}`);
}));

// GET route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show",{listing});
}));

// DELETE route
app.delete("/listings/:id",wrapAsync( async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// app.get("/testlisting",(req,res)=>{
//     let sampleListing=new listing({
//         title:"My Villa",
//         description:"By the beach",
//         price:12000,
//         location:"Calungate , Goa",
//         country:"India",
//     });

//     sampleListing.save().then(()=>{
//         console.log("saved to DB");
//     }).catch((err) =>{
//         console.log(err);
//     });
// });
 
// middleware for custom error handling
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!")); 
});

app.use((err,req,res,next)=>{
    let{statusCode=500, message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});



app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

