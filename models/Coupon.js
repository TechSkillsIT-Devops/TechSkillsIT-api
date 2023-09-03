const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
     
    couponCode: {
        type: String
    },
    validity:{
        type: Date
    },
    executiveId:{
        type: String
    },
    amount:{
        type: Number
    },
    userIds: {
        type: String
    }
});

module.exports = Coupon = mongoose.model('Coupon',CouponSchema);