const mongoose = require('mongoose');

const videoTrackingSchema = new mongoose.Schema({
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
  lastWatchedTimestamp: {
    type: Date,
    default: Date.now,
  },
  actualTime : {
    type: String ,
    default: 0,
  },
  progressInSeconds: {
    type: String ,
    default: 0,
  },
  status :{
    type : String,
    default : 'Incomplete'
  }
});

const VideoTracking = mongoose.model('VideoTracking', videoTrackingSchema);

module.exports = VideoTracking;