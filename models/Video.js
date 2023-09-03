const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
     
    title: {
        type: String
    },
    playlength: {
        type: Number
    },
    shortDescription:{
        type: String
    },
    sequence:{
        type: String
    },
    moduleId:{
        type: Number
    },
    code:{
        type: Number
    },
    hdcode:{
        type: Number
    }
});

module.exports = Video = mongoose.model('Video',VideoSchema);