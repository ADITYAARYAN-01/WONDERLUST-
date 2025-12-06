const express = require('express');
const mongoose = require('mongoose');
const Listing = require("./MODELS/listing.js")
const path = require("path");
const port = 8080;
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/",(req,res)=>{
    res.send("HI I AM ROOT")
})

// app.get("/testListings",async(req,res) =>{
//     let samplelisting = new Listing({
//         title : "NEW HOME",
//         description : "SDDSSDSDDSCSDC",
//         price : 2000,
//         location : "SCDSScs",
//         country:"INDIA"
//     });

//     await samplelisting.save();
//     console.log("SAMPLE WAS SAVED");
//     res.send("successful testing")
// })
 

app.get("/listings", async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
})

//New Routes
app.get("/listings/new", async (req,res) =>{
    res.render("listings/new");
})

// SHOW ROUTE
app.get("/listings/:id" , async(req,res) =>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show" , {listing})
})


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/WonderLustMain');
}
main()
    .then( c => {
       console.log("Connected Successfully");
    })
    .catch((err) =>{
        console.log(err);
    })



app.listen(port, () =>{
    console.log(`SERVER IS LISTENING ON PORT ${port}`)
})