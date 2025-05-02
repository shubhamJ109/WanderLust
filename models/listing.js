const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

// setting schema for mongodb 
const listingSchema = new Schema({
    title :{
        type : String,
        required: true
    }, 
    description : String,

    image : {
        default : "https://t4.ftcdn.net/jpg/06/23/51/11/360_F_623511140_HPst9DM1HwePp4fHqum63kMCz4fIrJoH.jpg",
        type : String,
        set: (v)=> v === "" ? "https://t4.ftcdn.net/jpg/06/23/51/11/360_F_623511140_HPst9DM1HwePp4fHqum63kMCz4fIrJoH.jpg" : v,
        
    },
    price : Number,
    location: String,
    country: String,

    reviews:[
        {
            type: Schema.Types.ObjectId ,
            ref:"review",
        },
    ],
});


listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await listing.deleteMany({_id: {$in : listing.reviews }}); 
    }
});
// creaating model using listing schema 
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;