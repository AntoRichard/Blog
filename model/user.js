var mongoose = require("mongoose"); 
var passportlocalmongoose = require("passport-local-mongoose");
var mongososeSchema = new mongoose.Schema({
    username : String,
    password : String
});
mongososeSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model("User",mongososeSchema);