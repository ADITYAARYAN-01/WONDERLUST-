module.exports.isLoggedIn = (req,res,next) =>{
    // console.log(req.path, "..",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","YOU MUST BE LOGGED IN TO CREATE LISTING");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}