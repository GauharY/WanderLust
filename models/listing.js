const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String, 
  image: {
    // type: String,
    filename: String,
    url:{
      type: String,
      default: "https://via.placeholder.com/300x200.png?text=Villa+Image" ,
    } 
    // set:(v)=>
    //     v===""?"https://via.placeholder.com/300x200.png?text=Villa+Image":v,
  },
  price: {
    type: Number,
    required: true
  },
  location: String,
  country: String
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;


