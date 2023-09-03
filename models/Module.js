const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
     
    name: {
        type: String
    },
    sequence: {
        type: Number
    },
     
    courseId:{
        type: Number
    } 
});

module.exports = Module = mongoose.model('Module',ModuleSchema);