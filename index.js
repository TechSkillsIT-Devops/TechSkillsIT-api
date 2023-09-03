/* Set up Express Server */
const express = require("express");
const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.prod' });
} else {
  dotenv.config({ path: '.env.dev' });
}

const { add } = require("./functions");
const fetch = require("node-fetch");
const { dbConnect } = require("./config/db");
const googleAuth = require("./routes/api/googleAuth");
const github = require("./routes/api/githubAuth");
const loginStrategy = require("./routes/api/localAuth");
const cors = require("cors");
const passport = require("passport");
const User = require("./models/User");
const app = express();
const middleware = require("./middleware/auth");




app.use(cors());
app.use(express.json());

//Connect DB
dbConnect();

/* create get for / */
app.get("/", (req, res) => {
  res.send({ value: add(10, 2) });
});


//define routes
app.use("/api/google", googleAuth);
app.use("/api/loginStrategy", loginStrategy);
app.use("/api//github", github);
app.use('/api/listing', require('./routes/api/listing'));
app.use('/api/track', require('./routes/api/track'));
app.use('/api/course', require('./routes/api/course'));
app.use('/api/module', require('./routes/api/module'));
app.use('/api/video', require('./routes/api/video'));


/* Api for calling Users */
app.get("/users", async (req, res) => {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/users");
    let data = await response.json();
    res.send(data);
  } catch (err) {
    res.send(400, { msg: err.msg });
  }
});

app.post("/user-info", middleware,(req, res) => {
  const decodedToken = decodeURIComponent(req.body.token);const jwt = require('jsonwebtoken');
        User.findOne({ token: decodedToken }, (err, user) => {
          try {
            if (err) {
              res.status(401).send({ message: err });
            }
            if (!user) {
              res.status(401).send({ message: "user not found" });
            }else{
              res.status(200).send({
                Id: user.Id,
                name: user.userName,
                email: user.email,
              });
            }
          } catch (e) {
            console.log(e);
          }
        });
      }
);


/* Set up port and start the server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("app working..");
});
