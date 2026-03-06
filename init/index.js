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

const initDB = async () => {
    await Listing.deleteMany({});

    // 1. Create the new array with the owner added
    const updatedData = initdata.data.map((obj) => ({
        ...obj, 
        owner: "69aa0bc076838f5350a8c51c"
    }));

    // 2. Insert the NEW updated array
    await Listing.insertMany(updatedData);
    
    console.log("DATA WAS INITIALIZED WITH OWNER");
};
initDB();