const mongoose = require('mongoose');

const EnrollCourseSchema = new mongoose.Schema({
     
    courseId: {
        type: String
    },
    userId: {
        type: Number
    },
    enrollDate:{
        type: Date,
        default: Date.now 
    },
    expiryDate:{
        type: Date
    },
    feePaid:{
        type: Number
    },
    coupon:{
        type: String
    }
});

module.exports = EnrollCourse = mongoose.model('EnrollCourse',EnrollCourseSchema);