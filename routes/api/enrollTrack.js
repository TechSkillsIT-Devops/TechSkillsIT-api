const express = require('express');
const router = express.Router();
const middleware = require("../../middleware/auth");
const EnrollTrack = require('../../models/EnrollTrack')



router.post('/enroll-track', middleware, (req, res) => {
   // Check if the enrollment already exists
   EnrollTrack.findOne({ userId: req.body.userId, trackId: req.body.trackId }, (err, existingEnroll) => {
       if (err) {
         console.log(err)
           res.status(500).send('Error occurred');
       } else if (existingEnroll) {
           // Enrollment already exists, send an error response
           res.status(400).send('Enrollment already exists');
       } else {
           // Enrollment doesn't exist, create and save a new one
           const enrollTrack = new EnrollTrack({
               userId: req.body.userId,
               trackId: req.body.trackId,
               enrollDate: Date.now(),
               expiryDate: Date.now(),
               feePaid: req.body.fee ?? '',
               coupon: req.body.coupon ?? ''
           });

           enrollTrack.save((err, enrolled) => {
               if (err) {
                   res.status(500).send('Error occurred');
               } else {
                   res.status(200).send(enrolled);
               }
           });
       }
   });
});

router.get('/enrolled-status/:userId/:trackId',middleware,(req, res)=>{
   const { userId, trackId } = req.params;
   EnrollTrack.findOne({ userId, trackId}, (err, existingEnroll) => {
      if (err) {
          res.status(500).send('Error occurred');
      } else if (existingEnroll) {
          // Enrollment already exists, send an error response
          res.status(200).send({message :'Enrollment already exists'});
      } else {
         res.status(200).send({message :'not Enrolled'})
      }
   })
})


router.get('/enrolledTrack-info',middleware,(req,res)=>{
   EnrollTrack.find({userId : req.body.userId},(err,track)=>{
     if(err || !req.body.userId){
      req.body.userId ? res.send(err) : res.status(401).send("userid not defined")
     }else {
      res.status(200).send(track)
     }
   })
})

router.delete('/delete-all',(req,res)=>{
   EnrollTrack.deleteMany({}, (err) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'All records deleted successfully' });
      }
    });
})
router.get('/all-tracks', (req, res) => {
   // Use Mongoose's find() method to retrieve all records in the "enrollTrack" collection
   EnrollTrack.find({}, (err, tracks) => {
     if (err) {
       console.error('Error retrieving records:', err);
       res.status(500).json({ error: 'Internal Server Error' });
     } else {
       res.status(200).json(tracks);
     }
   });
 });
 

module.exports = router