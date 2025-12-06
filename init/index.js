const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../MODELS/listing.js");

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

const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("DATA WAS INITIALIIZED");
};
initDB();