const express = require ('express');
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy;
const router = new express.Router();
const dotenv = require('dotenv').config();
const secretKey = 'YOUR_SECRET_KEY';
const jwt = require('jsonwebtoken');
const User = require('../../models/User')


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/github/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    try{
      console.log(profile)
      const user = {
        Id: profile.id,
        userName: profile.displayName,
        email: profile.email
      };
    
      let token 
      // Create a JWT token for the user
      User.find({ email: user.email }, (err, users) => {
        if (err) {
          return done(err, null);
        }
        if (!users || users.length === 0) { // Check if users array is empty
          token = jwt.sign(user, secretKey, { expiresIn: '500' });
          User.create({ ...user, token: token }, function (err, newUser) {
            if (err) {
              return done(err, null);
            }
            return done(null, newUser.token);
          });
        } else {
          token = jwt.sign(user, secretKey, { expiresIn: '500' });
          User.findByIdAndUpdate(users[0]._id, { $set: { token: token } }, { new: true }, (err, updatedUser) => {
            if (err) {
              console.log(err);
              return done(null, err);
            }
            console.log(updatedUser)
            return done(null, updatedUser.token);
          });
        }
      });
  }catch(e){
      console.log(e)
  }
  }
));


router.get('/',
  passport.authenticate('github', {scope: [ 'user:email' ] , prompt : 'select_account'}));

router.get('/auth/github/callback', 
(req, res, next) => {
  passport.authenticate('github', { failureRedirect: '/login' }, (err, token) => {
    if (err) {
      console.log(err)
      return next(err);
    }
    // Attach the token to the request object
    req.token = token;
    next();
  })(req, res, next);
},
function(req, res) {
  // Redirect to a page where the token can be easily copied from the URL
  const token = req.token
  res.redirect(`http://localhost:4200/dashboard?token=${token}`)
  // res.send(`JWT Token: ${token}`);
});


  module.exports = router