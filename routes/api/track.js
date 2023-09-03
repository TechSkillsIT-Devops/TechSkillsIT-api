/* Import Express and Router */
const express = require('express');
const router = express.Router();
 const bcrypt = require('bcryptjs');
const {body, validationResult} = require('express-validator'); 
 const Track = require('../../models/Track');
  
router.get('/',(req,res)=>{
    res.send('Track / called..')
});

router.post('/add',async (req,res)=>{
    const {name,listingId,fee,sequence} = req.body;
    let track = new Track({
        name,listingId,fee,sequence
    });
    track = await track.save();
    res.json({track});
});

router.get('/listing/all/:lid',async (req,res)=>{
    const lid = req.params['lid']; 
    let tracks = await Track.find({'listingId':lid})
    res.send(tracks);
});

router.get("/all", async (req, res) => {
    let tracks = await Track.find();
    tracks = tracks.sort((a,b)=>a.sequence - b.sequence);
    res.send(tracks);
  });

module.exports = router;