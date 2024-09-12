var express = require('express');
var router = express.Router();
const passport = require("passport");
const LocalStategy = require("passport-local");
const AdminCollection = require('../models/admin');
passport.use(new LocalStategy(AdminCollection.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password, fullname, contact } = req.body;
    await AdminCollection.register({ username, contact, fullname }, password);
    res.redirect("/users/profile");
  }
  catch (err) {
    console.log(err.message)
  }
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/users/profile",
  failureRedirect: "/login",
}), (req, res, next) => { });

module.exports = router;

//https://localhost:3000/signup
