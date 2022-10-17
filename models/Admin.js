const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseError =require("mongoose-errors");

const adminSchema = new mongoose.Schema({
    email : {type : String, required : true},
    password : {type : String, required : true}
});



adminSchema.plugin(uniqueValidator);
adminSchema.plugin(mongooseError);

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;