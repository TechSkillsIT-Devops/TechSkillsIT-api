const mongoose = require('mongoose');

const LastSeenVideo = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
      },
      videoId: {
        type: String,
        required: true,
      },
      courseId : {
        type: String,
        required: true,
      },
      moduleId :{
        type: String,
        required: true,
      },
    }
    )

    module.exports = Coupon = mongoose.model('lastSeenVideo',LastSeenVideo);

