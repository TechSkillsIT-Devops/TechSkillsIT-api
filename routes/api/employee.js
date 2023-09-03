/* Import Express and Router */
const express = require('express');
const router = express.Router();
const Employee = require('../../models/Employee');
const bcrypt = require('bcryptjs');
const {body, validationResult} = require('express-validator'); 
const User = require('../../models/User');

router.get('/',(req,res)=>{
    res.send('employee / called..')
});

router.post('/add',[
        body('name','Name is required').not().isEmpty(), 
        body('jobTitle','Job Title is required').not().isEmpty(),
        body('managerId','Manager Id is required').not().isEmpty(),
        body('email','Email is required').isEmail(),
        body('password','Password of min length 5 is required').isLength({min:5})
    ],async (req,res)=>{
        /* check if errors exists */
        const errors$ = validationResult(req);

        if(!errors$.isEmpty()){
            return res.status(400).json({errors: errors$.array()}); 
        }

    const {name,jobTitle,managerId,email,password} = req.body;
    const role='EMPLOYEE'; 

    let employee = new Employee({
        name,jobTitle,managerId,email 
    });
    
    let status = '0';
    let user = new User({
        email,password,role,status
    })
    /* Encrypt the password */
    const salt = await bcrypt.genSalt(10); //salt generated

    user.password = await bcrypt.hash(password,salt); 
    
    employee = await employee.save();
    user = await user.save();
    
    res.json({employee});
});

router.get('/grant-access/:email',async (req,res)=>{
    const email = req.params['email']; 

    let user = await User.findOne({email});
    user.status = '1';

    user = await user.save();
    res.json({user});
});

module.exports = router;