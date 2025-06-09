const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError");
const Session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const port = 8080;
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");


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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized:true,  
    cookie:{
        expires:Date.now() + 7 * 24 * 60 *60 * 1000,
        maxAge: 7 * 24 * 60 *60 * 1000,
        httpOnly:true,
    },
};


app.get("/", (req, res)=>{
    res.send(`Server is started at port ${port}`);
});


app.use(Session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


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
