
var mongoose = require('mongoose');

var mongooseSchema=mongoose.Schema;
var userSchema = {
	"name":String,
	"email":String
};
module.exports=mongoose.model('user',userSchema);