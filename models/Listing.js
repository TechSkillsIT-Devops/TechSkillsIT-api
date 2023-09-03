const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
     
    name: {
        type: String
    },
    sequence: {
        type: Number
    }, 
    
});

module.exports = Listing = mongoose.model('Listing',ListingSchema);