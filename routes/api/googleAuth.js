const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const router = new express.Router();
const secretKey = "YOUR_SECRET_KEY";
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// using google strategy for login via google api
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      try {
        const user = {
          userName: profile.displayName,
          email: profile.emails[0].value,
        };
        let token;
        // Create a JWT token for the user
        User.find({ email: user.email }, (err, users) => {
          if (err) {
            return done(err, null);
          }
          if (!users || users.length === 0) {
            // Check if users array is empty
            token = jwt.sign(user, secretKey, { expiresIn: '24h'});
            User.create({ ...user, token: token }, function (err, newUser) {
              if (err) {
                return done(err, null);
              }
              return done(null, newUser.token);
            });
          } else {
            token = jwt.sign(user, secretKey, { expiresIn: "24h" });
            User.findByIdAndUpdate(
              users[0]._id,
              { $set: { token: token } },
              { new: true },
              (err, updatedUser) => {
                if (err) {
                  console.log(err);
                  return done(null, err);
                }
                console.log(updatedUser);
                return done(null, updatedUser.token);
              }
            );
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  )
);
// passport strategy for google is used here that is above method for authenctication via gmail.com
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);

// redirecting the usrl once authenication is done
router.get(
  "/auth/google/callback",
  (req, res, next) => {
    passport.authenticate(
      "google",
      { failureRedirect: "/login" },
      (err, token) => {
        if (err) {
          console.log(err);
          return next(err);
        }
        // Attach the token to the request object
        req.token = token;
        next();
      }
    )(req, res, next);
  },
  function (req, res) {
    // Redirect to a page where the token can be easily copied from the URL
    const token = req.token;
    res.redirect(`${process.env.REDIRECT_URL_UI}/dashboard?token=${token}`);
  }
);

router.get("/token", (req, res) => {
  const token = req.query.token;
  res.send(`JWT Token: ${token}`);
});

// it is not mandatory as if now once the we have the ui this can used for succes authentication

router.get("/auth/google/success", async (req, res) => {
  res.send(`<h3>loggedIn</h3>`);
});

module.exports = router;
