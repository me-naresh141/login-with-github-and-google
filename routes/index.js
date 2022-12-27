var express = require("express");
let User = require("../models/user");
var router = express.Router();
let passport = require("passport");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sucess", (req, res, next) => {
  // console.log(req.session, req.user);
  return res.render("sucess");
});

router.get("/failure", (req, res, next) => {
  res.render("failure");
});

// github route
router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/failure" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/sucess");
  }
);

// google route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/sucess");
  }
);
//

router.get("/login", (req, res, next) => {
  res.render("login");
});
router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  // console.log(req.body);
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    console.log(user);
    res.redirect("/login");
  });
});

router.post("/login", (req, res, next) => {
  let { password, email } = req.body;
  if (!password || !email) {
    return res.redirect("/login");
  }
  User.findOne({ email }, (err, user) => {
    if (!user) {
      return res.redirect("/login");
    }
    // password compare
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        return res.redirect("/login");
      }
      // sesson
      req.session.userId = user.id;
      return res.redirect("/sucess");
    });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  // Don't redirect, just print text
  res.redirect("/");
});

module.exports = router;
