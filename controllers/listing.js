const Listing = require("../MODELS/listing");

//index route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

// new Route
module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new");
}

// show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate :{
            path : "author"
        },
    })
    if(!listing){
        req.flash("error","listing does not exist");
        return res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show", { listing })
}

//create route

module.exports.createListing = async (req, res, next) => {
    let listingnew = new Listing(req.body.listing);
    listingnew.owner = req.user._id;
    await listingnew.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings")
}

//edit route
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing does not exist");
        return res.redirect("/listings")
    } 
    res.render("listings/edit", { listing });
}

//UPDATE LISTING
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`)
}

// DELETE LISTING

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleted_listing = await Listing.findByIdAndDelete(id);
    console.log(deleted_listing)
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}