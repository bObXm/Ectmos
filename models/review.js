//cap46 curs1
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    // cap52curs5
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    
});

module.exports = mongoose.model("Review", reviewSchema);





































