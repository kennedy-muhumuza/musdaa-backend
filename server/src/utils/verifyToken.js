const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  let token;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.send({
      status: "fail",
      message: "No token provided, please login",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;
    const user = await User.findById(userId);

    if (!user.rows[0]) {
      return res.send({
        status: "fail",
        message: "User belonging to this token no longer exists",
      });
    }

    req.user = decoded;
  } catch (err) {
    console.log(err.message);
    return res.send({ message: "Invalid Token", status: "fail" });
  }

  return next();
};

module.exports = { verifyToken };
