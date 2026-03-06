module.exports.isLoggedIn = (req,res,next) =>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error","YOU MUST BE LOGGED IN TO CREATE LISTING");
        return res.redirect("/login");
    }
    next();
}