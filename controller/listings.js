const Listing = require("../models/listing");

module.exports.index = async(req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};

module.exports.renderNewForm = (req, res)=>{  
    res.render("listings/new");
};

module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
   // <-- This will populate the owner field
    .populate({
       path: "reviews",
       populate:{
        path: "author",
       },
    })
    .populate("owner"); // <-- This will populate the owner field with username and email
    if(!listing){
        req.flash("error", "Listings you requested for does not exists !");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", {listing});
};

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // <-- Set the owner to the current user
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm =  async (req, res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listings you requested for does not exists !");
        return res.redirect("/listings");
    }
    res.render("listings/edit", {listing});
};

module.exports.updateListing = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "listing Updated!");
    res.redirect(`/listings/${id}`); 
};

module.exports.deleteListing = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted !");
    res.redirect('/listings');
};
