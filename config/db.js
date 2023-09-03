const mongoose = require('mongoose');

function dbConnect(){
    try{
        mongoose.connect('mongodb+srv://techskillsit:c5ty9DYvjahnel5L@cluster0.ay1gjkf.mongodb.net/?retryWrites=true&w=majority');
        console.log('MongoDB connected..');
    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }
    
}

module.exports = {dbConnect};