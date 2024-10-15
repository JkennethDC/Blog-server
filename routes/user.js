const express = require("express");
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require('../auth');

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getProfile);
router.get("/allUser", verify, verifyAdmin, userController.getAllUsers)

module.exports = router;