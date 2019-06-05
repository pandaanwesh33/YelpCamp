var mongoose = require('mongoose');

// create the comment schema
var commentSchema = mongoose.Schema({
   text: String,
   author: {
      id : {
         type : mongoose.Schema.Types.ObjectId,
         ref  : "User"
      },
      username : String
   }
});

// create model and export it

module.exports = mongoose.model("Comment", commentSchema);