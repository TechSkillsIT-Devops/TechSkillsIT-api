/* Import Express and Router */
const express = require('express');
const router = express.Router();
const Employee = require('../../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../../models/User');
const auth = require('../../middleware/auth');

 
router.post('/login',async (req,res)=>{

    const {email,password} = req.body;
    try{ 
         //first verify email 
    let user = await User.findOne({email});

    if(!user){
        return res.status(400).json(
            {
                errors: [{msg: "Invalid Credentials"}]
            })
    }
    if(user.status == '0'){
        return res.status(400).json(
            {
                errors: [{msg: "Access Not granted"}]
            })
    }
    //now verify password
    const isCorrect = await bcrypt.compare(password,user.password);

    if(!isCorrect){
        return res.status(400).json(
            {
                errors: [{msg: "Invalid Credentials"}]
            })
    }

    const payload={
        user:{
            id: user.id
        }
    }
    jwt.sign(
        payload,
        '123456',
        {expiresIn: 36000 }, 
        (err,token)=>{
            if(err) throw err;
            res.json({token}); 
        });
    }
    catch(err){
        res.status(500).send('Server Error'); 
    }
});


router.get('/user', auth,async (req,res)=>{
    const {id,email} = req.user;
    try{   
         const user = await User.findById(id).select('-password');
         const employee = await Employee.findOne(email);

         res.json({employee});
    }
    catch(err){
        res.status(500).send('Server Error'); 
    }
    
});

module.exports = router;