const express = require('express');
const router = express.Router();
const User = require("../MODELS/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { savedRedirectUrl } = require("../middleware.js")
const userController = require("../controllers/user.js")


router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup))


// router.get("/signup", userController.renderSignupForm)
// router.post("/signup", wrapAsync(userController.signup))

// for login
router.get("/login", userController.renderLoginForm)

router.post(
    "/login", savedRedirectUrl, passport.authenticate("local",
        { 
            failureRedirect: "/login", failureFlash: true

        }),
    userController.login
)

//logout

router.get("/logout", userController.logout)
module.exports = router