const express = require("express");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const router = new express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = "YOUR_SECRET_KEY";


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


router.post("/register", async (req, res) => {
  try {
    const { email, userName, password } = req.body;
    console.log(req.body)
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    User.findOne({ email }, async (err, user) => {
      if (user) {
        res.status(500).json({ error: "Registration failed" });
      } else {
        const newUser = new User({
          email,
          userName,
          password : hashedPassword,
          token: jwt.sign({ username: userName },secretKey, { expiresIn: '24h' }),
        });
        await newUser.save();
        res.json({ message: "Registered successfully", token : newUser.token });
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Registration failed" });
  }
});




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
