const express = require("express");
const router = express.Router();
const {
  registerUser,
  userLogin,
  userLogout,
  getUsers, //created to just see all the users here
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(userLogout);
router.route("/users").get(getUsers);

module.exports = router;
