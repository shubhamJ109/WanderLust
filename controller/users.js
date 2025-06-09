const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res) => {
   try{
     const { username, email , password } = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
    });
   }catch(err){
    console.log(err);
    req.flash("error", err.message);
    res.redirect("/signup");
   }};

   module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login =  async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        res.redirect(res.locals.redirectUrl || "/listings");
    };

module.exports.logout = (req,res ,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings"); 
    });
};
