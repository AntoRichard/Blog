var mongoose = require("mongoose");
var detailsSchema = new mongoose.Schema({
    name:"String",
    dob:"String",
    phone:"String",
    username:"String",
    password:"String"
});
module.exports = mongoose.model("details",detailsSchema);