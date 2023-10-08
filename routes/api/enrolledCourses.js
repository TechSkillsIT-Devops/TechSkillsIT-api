const express = require('express');
const router = express.Router();
const middleware = require("../../middleware/auth");
const EnrollCourses = require("../../models/EnrollCourse");
const Course = require("../../models/Course");




router.post('/enroll-courses',(req, res)=>{
    const courses = new EnrollCourses({
        courseId: req.body.courseId,
        userId: req.body.userId,
        feePaid: req.body.fee,
        coupon: req.body.coupon ?? ""
    })

    courses.save((err, enrolled) => {
        if (err) {
            res.status(500).send('Error occurred');
        } else {
            res.status(200).send(enrolled);
        }
    });

   

})

router.get('/course-status/:userId/:courseId',(req, res)=>{
    const { userId, courseId } = req.params;
    EnrollCourses.findOne({ userId, courseId}, (err, existingEnroll) => {
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


 router.get('/all-enrolled-courses/:userId',middleware, async (req, res) => {
    const userId = req.params.userId;
    try {
      const enrolledCourses = await EnrollCourses.find({ userId }).exec();
      const courseIds = enrolledCourses.map((element) => element.courseId);
  
      const courses = await Course.find(
        { _id: { $in: courseIds } },
        { _id: 1, name: 1 ,trackId : 1}
      ).exec();
  
      res.status(200).send(courses);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error occurred');
    }
  });
  
  
 




module.exports = router