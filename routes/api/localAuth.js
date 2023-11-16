const express = require("express");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const router = new express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = "YOUR_SECRET_KEY";
const emailVerferfication = require('../../middleware/email')
const helper =  require('../../helper')


passport.use(new LocalStrategy({
    usernameField : 'userName',
    passwordField : 'password'
},
    async (userName, password, done) => {
      try {
       
        const user = await User.findOne({ userName });
  
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (!passwordMatch) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  const userStorage = new Map();

  // Step 1: Generate and store unique OTP for each user
  const generateAndStoreOTP = (userEmail) => {
    const otp = helper.generateOTP();
    const timestamp = new Date();
    const expirationTime = new Date(timestamp.getTime()+ 15 * 60 * 1000) ;
    userStorage.set(userEmail, { otp, timestamp,expirationTime, verified: false });
    return otp;
  };

router.post("/register", async (req, res) => {
  try {
    const { email, userName, password } = req.body;
    // Hash the password before saving
   
    User.findOne({ email }, async (err, user) => {
      if (user) {
        res.status(500).json({ error: "Registration failed" });
      } else {
         const otp = generateAndStoreOTP(email);
         const emaildata = {
          title : `Welcome ${userName} ,`,
          message : 'Thank you for joining us. Please verify your email with below otp to proceed further',
          otp
      }
        
       
        emailVerferfication.sendEmail(email,'Verfication email','login', emaildata).then(()=>{
          res.status(200).json({ message : 'otp send succussfully' });
        }).catch(err => console.log(err));
       
        // res.json({ message: "Registered successfully", token : newUser.token });
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post('/verify-email',async (req, res)=>{
  try{
    const { email,userName, password, otp} = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    const userboolean =  userStorage.has(email);
    if(!userboolean){
     res.status(500).json({ message  : 'no  email found'});
    }else if(userboolean){
      const verficationOtp =  userStorage.get(email).otp;
      const isExpired = helper.isOTPExpired(email,userStorage);
      if(verficationOtp === otp && !isExpired){
       const newUser = new User({
         email,
         userName,
         password : hashedPassword,
         emailVerified : true,
         token: jwt.sign({ username: userName },secretKey, { expiresIn: '24h' }),
       });
       await newUser.save();
       userStorage.delete(email);
       res.status(200).json({ message: "Registered successfully", token : newUser.token });
      }else if(isExpired){
        res.status(500).json({ message: "otp expired"});
      }
    }
  }catch(err){
    console.log(err)
    res.status(500).json({ err: "Registration failed" });
  }
}
)



  router.post("/login",  (req, res, next) => {
    passport.authenticate('local',{session : false},(err, user) => {      
      if(err){
        console.log(err)
      }
      if(!user){
        res.send('invalid user');
      }else{
        const token = jwt.sign({ userame: Object.values(user)[2].userName },  secretKey , { expiresIn :  '24h'});
        User.findByIdAndUpdate(
           user._id,
            { $set: { token: token } },
            { new: true },
            (err, updatedUser) => {
              if (err) {
                next(err);
              }
              console.log('updated')
            req.token = updatedUser.token;
            next();
            }
          );
      }
     
    })(req, res, next);
  },(req, res) => {
    // Redirect to a page where the token can be easily copied from the URL
    const token = req.token;
    res.json({ message: "loggedIn successfully", token : token });
  });



module.exports = router;
