/* Import Express and Router */
const express = require('express');
const router = express.Router();
 const bcrypt = require('bcryptjs');
const {body, validationResult} = require('express-validator'); 
 const Module = require('../../models/Module');
  
router.get('/',(req,res)=>{
    res.send('Module / called..')
});

router.post('/add',async (req,res)=>{
    const {name,sequence,courseId} = req.body;
    let module = new Module({
        name,sequence,courseId
    });
    module = await module.save();
    res.json({module});
});

router.get('/course/all/:cid',async (req,res)=>{
    const cid = req.params['cid']; 
    let modules = await Module.find({'courseId':cid});
    modules = modules.sort((a,b)=>a.sequence - b.sequence);
    res.send(modules);
  });


module.exports = router;