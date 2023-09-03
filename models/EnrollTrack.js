const mongoose = require('mongoose');

const EnrollTrackSchema = new mongoose.Schema({
     
    trackId: {
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

module.exports = EnrollTrack = mongoose.model('EnrollTrack',EnrollTrackSchema);