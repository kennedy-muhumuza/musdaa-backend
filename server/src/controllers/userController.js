const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// register
const register = async (req, res) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByEmail(email);

    if (user.rows[0]) {
      return res.send({ message: "Email already registered", status: "fail" });
    }

    await User.create(firstName, lastName, email, hashedPassword);
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
      user_id: user.rows[0].user_id,
      first_name: user.rows[0].first_name,
      last_name: user.rows[0].last_name,
    };
    res.send({
      userDataObject: userObject,
      token: token,
      message: "login successful",
      status: "success",
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { register, login };
