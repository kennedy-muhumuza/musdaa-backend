const express = require("express");
const {
  register,
  login,
  registerAdmin,
  generateAdminToken,
  getAdminTokens,
} = require("../controllers/userController");

const { verifyAdminToken } = require("../utils/verifyAdminToken");

const router = express.Router();

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.post("/generate-token", verifyAdminToken, generateAdminToken);
router.get("/get-tokens", verifyAdminToken, getAdminTokens);
// router.get("/get-tokens/:generatedById", getAdminTokens);//req.params
// router.get("/get-tokens", getAdminTokens);
// router.post("/generate-token", generateAdminToken);

module.exports = router;
