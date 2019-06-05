var mongoose = require('mongoose');

// create the comment schema
var commentSchema = mongoose.Schema({
   text: String,
   author: String
});

// create model and export it

module.exports = mongoose.model("Comment", commentSchema);