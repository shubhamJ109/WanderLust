const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError");
const port = 8080;

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


// Connect with Mongodb
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}
main().then(()=>{
    console.log("Database is Connected ");
}).catch((err)=>{
    console.log("Database Error");
});

// Setting ejs  
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// To parse all data come form url get req
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res)=>{
    res.send(`Server is started at port ${port}`);
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next)=>{
   let {statusCode = 500 , message = "Something Went Wrong !! "} = err;
    res.status(statusCode).render("error", {err});
   //res.status(statusCode).send(message);
});

app.listen(port, ()=>{
    console.log("server is listening at prot", port);
})