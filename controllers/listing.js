const Listing = require("../MODELS/listing");

// for MAP
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAP_TOKEN;

//index route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

// new Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}

// show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
    if (!listing) {
        req.flash("error", "listing does not exist");
        return res.redirect("/listings")
    }
    // MAP_TOKEN 
    res.render("listings/show", {
        listing,
        mapToken: process.env.MAP_TOKEN
    });
    // console.log(listing);
    // res.render("listings/show", { listing })
}

//create route

module.exports.createListing = async (req, res, next) => {
    // We remove the backend geocoding call because the coordinates 
    // are now coming directly from the form's hidden inputs!

    let url = req.file.path;
    let filename = req.file.filename;

    // req.body.listing now contains: title, description, price, location, country, AND geometry
    const listingnew = new Listing(req.body.listing);
    
    listingnew.owner = req.user._id;
    listingnew.image = { url, filename };

    // MongoDB will automatically save the geometry object we sent via the hidden inputs
    let savedListing = await listingnew.save();
    
    console.log("Listing saved with coordinates:", savedListing.geometry.coordinates);

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

//edit route
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing does not exist");
        return res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    
    // ADD mapToken here so edit_map.js can use it!
    res.render("listings/edit", { 
        listing, 
        originalImageUrl, 
        mapToken: process.env.MAP_TOKEN 
    });
}

//UPDATE LISTING
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
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