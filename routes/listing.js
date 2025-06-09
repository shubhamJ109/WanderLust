const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const {isLoggedIn, isowner, validateListing} = require("../routes/middleware.js");

const listingsController = require("../controller/listings");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });




router.route("/")
    .get(wrapAsync(listingsController.index))
    // .post( isLoggedIn, validateListing, wrapAsync(listingsController.createListing));
    .post(upload.single("listing[image]"),(req, res)=>{
        res.send(req.file);
    });

    // new Route 
router.get("/new", isLoggedIn, listingsController.renderNewForm);

router.route("/:id")
    .get( wrapAsync( listingsController.showListing))
    .put(isLoggedIn,isowner, validateListing, wrapAsync( listingsController.updateListing))
    .delete(isLoggedIn ,isowner, wrapAsync( listingsController.deleteListing));

// Edit route
router.get("/:id/edit",isLoggedIn,isowner, wrapAsync(listingsController.renderEditForm));

module.exports = router;
