const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
     
    name: {
        type: String
    },
    listingId:{
        type: Number
    },
    fee:{
        type: Number
    },
    sequence:{
        type: Number
    }
});

module.exports = Track = mongoose.model('Track',TrackSchema);