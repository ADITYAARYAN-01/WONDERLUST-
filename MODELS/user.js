const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose").default
// console.log("Type of plugin:", typeof passportLocalMongoose);
// console.log("Plugin value:", passportLocalMongoose);
const userSchema = new Schema({
    email:{
        type:String,
        required: true
    }
}); 

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User" , userSchema); 