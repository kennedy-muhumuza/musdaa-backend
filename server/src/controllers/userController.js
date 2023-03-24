const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const { number } = require("joi");

// register  normal user
const register = async (req, res) => {
  try {
    console.log("req body");
    console.log(req.body);

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const country = req.body.country;
    const telNumber = req.body.telNumber;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = req.body.userRole;
    const isVerifiedEmail = false;
    const token = crypto.randomBytes(16).toString("hex");

    const user = await User.findByEmail(email);

    if (user.rows[0]) {
      return res.send({ message: "Email already registered", status: "fail" });
    }

    await User.create(
      firstName,
      lastName,
      email,
      country,
      telNumber,
      hashedPassword,
      isVerifiedEmail,
      token,
      userRole
    );
    res.send({ message: "user registered successfully", status: "success" });
  } catch (error) {
    console.log(error.message);
  }
};

// register admin
const registerAdmin = async (req, res) => {
  try {
    // get variables from the frontend

    console.log("req body");
    console.log(req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const country = req.body.country;
    const telNumber = req.body.telNumber;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = req.body.userRole;
    const adminToken = req.body.adminToken;
    const isVerifiedEmail = false;
    const token = crypto.randomBytes(16).toString("hex");
    const user = await User.findByEmail(email);

    if (user.rows[0]) {
      return res.send({ message: "Email already registered", status: "fail" });
    }
    // validation, admin token, date
    const getAdminToken = await User.findToken(adminToken);

    const savedToken = getAdminToken.rows[0];

    console.log("getAdminToken.rows");
    console.log(getAdminToken.rows);
    console.log("savedToken");
    console.log(savedToken);

    if (!savedToken) {
      return res.send({ message: "Token does not exist", status: "fail" });
    }
    // check usage

    console.log("getAdminToken.rows[0].is_used");
    console.log(getAdminToken.rows[0].is_used);

    if (savedToken.is_used) {
      return res.send({ message: "Token already used", status: "fail" });
    }
    // check expiry

    if (User.tokenExpired(savedToken.expires_at)) {
      return res.send({ message: "Token has expired", status: "fail" });
    }

    if (savedToken.associated_email !== email) {
      return res.send({
        message: "Email does not match the provided token",
        status: "fail",
      });
    }

    await User.create(
      firstName,
      lastName,
      email,
      country,
      telNumber,
      hashedPassword,
      isVerifiedEmail,
      token,
      userRole
    );

    const tokenId = savedToken.token_id;
    const usedAt = new Date(Date.now()).toISOString();
    const isUsed = true;

    await User.InvalidateAdminToken(tokenId, usedAt, isUsed);

    res.send({ message: "user registered successfully", status: "success" });
  } catch (error) {
    console.log(error.message);
  }
};

const assignToken = (userId) => {
  console.log("assigning token");
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findByEmail(email);
    if (!user.rows[0]) {
      return res.send({ message: "Email Not registered", status: "fail" });
    }
    if (!(await bcrypt.compare(password, user.rows[0].password))) {
      return res.send({ message: "Incorrect password", status: "fail" });
    }

    const token = assignToken(user.rows[0].user_id);

    const userObject = {
      userId: user.rows[0].user_id,
      firstName: user.rows[0].first_name,
      lastName: user.rows[0].last_name,
      email: user.rows[0].email,
      country: user.rows[0].country,
      telNumber: user.rows[0].tel_number,
      userRole: user.rows[0].user_role,
    };
    res.send({
      user: userObject,
      token: token,
      message: "login successful",
      status: "success",
    });
  } catch (error) {
    console.log(error.message);
  }
};

const generateRandom = () => {
  const number = Math.random() * 1000000;
  return Math.floor(number);
};

const generateAdminToken = async (req, res) => {
  try {
    const generatedAt = new Date(Date.now()).toISOString();
    const expiresInHours = 1000 * 60 * 60 * 24;
    const expiresAt = new Date(Date.now() + expiresInHours).toISOString();

    const generatedById = req.body.generatedById;
    const associatedEmail = req.body.associatedEmail;

    const user = await User.findByEmail(associatedEmail);
    if (user.rows[0]) {
      return res.send({ message: "Email already registered", status: "fail" });
    }

    const token = generateRandom();

    await User.createToken(
      generatedAt,
      generatedById,
      associatedEmail,
      token,
      expiresAt
    );

    res.send({
      message: "Admin token generated successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getAdminTokens = async (req, res) => {
  try {
    const generatedById = req.body.generatedById;
    const getAdminTokens = await User.findTokenByGeneratedById(generatedById);

    res.send({ adminTokens: getAdminTokens.rows, status: "success" });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  register,
  login,
  registerAdmin,
  generateAdminToken,
  getAdminTokens,
};
