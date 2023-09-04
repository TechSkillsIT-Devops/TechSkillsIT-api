/* Import Express and Router */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const Course = require("../../models/Course");

router.get("/", (req, res) => {
  res.send("course / called..");
});

router.post("/add", async (req, res) => {
  const {
    name,
    description,
    shortDescription,
    featured,
    trainerId,
    fee,
    cfeezoom,
    introVideoCode,
    keywords,
    technicalWeightage,
    type,
    sequence,
    trackId,
  } = req.body;
  let course = new Course({
    name,
    description,
    shortDescription,
    featured,
    trainerId,
    fee,
    cfeezoom,
    introVideoCode,
    keywords,
    technicalWeightage,
    type,
    sequence,
    trackId,
  });

  course = await course.save();
  res.json({ course });
});

router.get("/all", async (req, res) => {
  let courses = await Course.find();
  res.send(courses);
}); 

router.get('/track/all/:tid',async (req,res)=>{
  const tid = req.params['tid']; 
  let courses = await Course.find({'trackId':tid});
  courses = courses.sort((a,b)=>a.sequence - b.sequence);
  res.send(courses);
});
 
module.exports = router;
