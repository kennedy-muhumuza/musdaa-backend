const db = require("../db/config");

const User = {};

User.findByEmail = (email) => {
  return db.query("SELECT * FROM users WHERE email = $1", [email]);
};

User.findById = (userId) => {
  return db.query("SELECT * FROM users WHERE user_id = $1", [userId]);
};

User.create = (firstName, lastName, email, password) => {
  return db.query(
    "INSERT INTO users(first_name, last_name, email, password) VALUES($1,$2,$3,$4)",
    [firstName, lastName, email, password]
  );
};

module.exports = User;
