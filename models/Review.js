const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
     
    rreviewText: {
        type: String
    },
    rrating: {
        type: String
    },
    courseId:{
        type: Number
    },
    rdate:{
        type: Date
    },
    studentId:{
        type: Number
    }
});

module.exports = Review = mongoose.model('Review',ReviewSchema);