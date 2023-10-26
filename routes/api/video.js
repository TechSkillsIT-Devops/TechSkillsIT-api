/* Import Express and Router */
const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator'); 
const Video = require('../../models/Video');
const VideoProgress =  require('../../models/VideoStatus');
const middleware = require("../../middleware/auth");
const LastSeenVideo =  require("../../models/lastSeenVideo")
    
router.get('/',(req,res)=>{
    res.send('Video / called..')
});

router.post('/add',async (req,res)=>{
    const {title,playlength,shortDescription,sequence,moduleId,code,hdcode} = req.body;
    let video = new Video({
        title,playlength,shortDescription,sequence,moduleId,code,hdcode
    });
    video = await video.save();
    res.json({video});
});

router.get('/module/all/:mid',async (req,res)=>{
    const mid = req.params['mid']; 
    let videos = await Video.find({'moduleId':mid});
    videos = videos.sort((a,b)=>a.sequence - b.sequence);
    res.send(videos);
  });

  router.post('/video-progress',  async (req,res)=>{
    const { userId, videoId, progressInSeconds , courseId, moduleId ,actualTime, status } = req.body;
    try {
    // Find or create a tracking document for the user
    let tracking = await VideoProgress.findOne({userId ,videoId});
    if (!tracking) {
      tracking = new VideoProgress({ userId, videoId ,courseId, moduleId , actualTime});
    }
    let lastSeen = await LastSeenVideo.findOne({ userId, courseId});
    if(!lastSeen){
      lastSeen =  new LastSeenVideo({ userId, courseId, moduleId, videoId})
    }

    lastSeen.moduleId = moduleId
    lastSeen.videoId = videoId;
    await lastSeen.save();
     

    tracking.progressInSeconds = progressInSeconds;
    tracking.lastWatchedTimestamp = new Date();
    if(status === 'completed') tracking.status = 'completed'

    await tracking.save();

    res.status(200).json({ message: 'Last watched video updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  }) 

  router.get('/last-seen/:userId/:courseId',async (req,res)=>{
     try{
      const { userId, courseId}= req.params;
      const lastSeen =  await LastSeenVideo.findOne({ userId, courseId});
      const videoPrgress =  await VideoProgress.findOne({userId ,videoId : lastSeen.videoId })
      if(!lastSeen){
        res.status(200).send("Not found");

      }else {
        const updatedLastSeen = { ...lastSeen.toObject() };
        updatedLastSeen.videoSeconds = videoPrgress.progressInSeconds;
        res.status(200).send(updatedLastSeen);
      }
     
     }catch(e){
       console.error(e);
       res.status(500).send("Error occured")
     }
  })

module.exports = router;