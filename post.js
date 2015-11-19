var mongoose = require('mongoose');

//configure connection URL

mongoose.connect('mongodb://admin:rossi90338@ds055574.mongolab.com:55574/junkdata');

var postSchema = mongoose.Schema({
        title:String,
        content:String
});

var Post = mongoose.model('Post',postSchema);

module.exports = Post;