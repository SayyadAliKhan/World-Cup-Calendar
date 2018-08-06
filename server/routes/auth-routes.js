const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");

//auth login
router.post("/login", (req, res) => {
  let username = req.body.name;
  let password = req.body.password;

  User.findOne({ username: username }, (err, user) => {
    if (err) {
      return res
        .status(500)
        .send({ access: false, mesg: "Database Server Problem" });
    }

    if (!user) {
      return res
        .status(404)
        .send({ access: false, mesg: "User doesn't exist in a database" });
    }
  //to do: use bcrypt to get hash password
    if (user.password != password) {
      return res
        .status(400)
        .send({ access: false, mesg: "Incorrect Password" });
    }

    req.session.user = user;
    return res
      .status(200)
      .send({ access: true, userData: user, mesg: "Success" });
  });
});

//auth register
router.post("/register", (req, res) => {
  console.log("Inside Register");

  var newUser = new User();
  newUser.username = req.body.name;
  newUser.password = req.body.password;
  newUser.email = req.body.email;

  User.findOne({ $or: [{ username: newUser.username }, { email: newUser.email }] },
    (err, data) => {
      if (err) {
        res.status(500).send();
      }

      if (data) {
        let filler = data.username ? "Username" : "Email ID";
        res.status(400).send({ mesg: `${filler} already exist in a database` });
      } else {
        //to do:  bcrypt to has password before saving
        newUser.save((err, savedUser) => {
          if (err) {
            console.log(err);
            res.status(500).send({ userData: null });
          }
          req.session.user = user;
          res.status(200).send({ userData: savedUser });
        });
      }
    }
  );
});

//auth logout
router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send();
});

//auth google
router.get("/google", passport.authenticate("google", {
    scope: ["profile"]
  })
);

//callback route for google to redirect
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.status(200).send({ userData: req.user });
});

module.exports = router;
