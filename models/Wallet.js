const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
     
    userId: {
        type: String
    },
    balance:{
        type: Number
    }
});

module.exports = Wallet = mongoose.model('Wallet',WalletSchema);