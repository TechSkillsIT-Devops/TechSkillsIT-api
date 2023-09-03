/* Import Express and Router */
const express = require('express');
const router = express.Router();
 const {body, validationResult} = require('express-validator'); 
  const Video = require('../../models/Video');
    
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

module.exports = router;