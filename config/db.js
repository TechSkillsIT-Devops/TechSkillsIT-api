const mongoose = require('mongoose');

function dbConnect(){
    try{
        console.log('MongoDB starting..');
        mongoose.connect(process.env.DB_URL);
        console.log('MongoDB connected..');
    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }
    
}

module.exports = {dbConnect};