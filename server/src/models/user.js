const db = require("../db/config");

const User = {};

User.findByEmail = (email) => {
  return db.query("SELECT * FROM users WHERE email = $1", [email]);
};

User.findById = (userId) => {
  return db.query("SELECT * FROM users WHERE user_id = $1", [userId]);
};

User.create = (
  firstName,
  lastName,
  email,
  country,
  telNumber,
  password,
  isVerifiedEmail,
  userVerifyToken,
  userRole
) => {
  return db.query(
    "INSERT INTO users(first_name, last_name, email, country, tel_number, password, is_verified_email, user_verify_token, user_role) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",
    [
      firstName,
      lastName,
      email,
      country,
      telNumber,
      password,
      isVerifiedEmail,
      userVerifyToken,
      userRole,
    ]
  );
};

// update password
User.updatePassword = (newHashedPassword, userId, userEmail) => {
  return db.query(
    "UPDATE users SET password = $1 WHERE user_id = $2 AND email =$3 RETURNING *",
    [newHashedPassword, userId, userEmail]
  );
};

// Get user by verify_token
User.getUserByToken = (token) => {
  return db.query("SELECT * FROM users WHERE user_verify_token =$1", [token]);
};

// Get all users
User.getAllUsers = () => {
  return db.query("SELECT * FROM users");
};

// update verify Token
User.updateVerifyToken = (userId, verifyToken) => {
  return db.query(
    "UPDATE users SET user_verify_token = $1 WHERE user_id = $2 RETURNING *",
    [verifyToken, userId]
  );
};

User.findToken = (adminToken) => {
  return db.query("SELECT * FROM admin_tokens WHERE token = $1", [adminToken]);
};

// token_id SERIAL PRIMARY KEY,
//  generated_at VARCHAR(50) NOT NULL,
//  generated_by_id  VARCHAR(50) NOT NULL,
//  associated_email  VARCHAR(50)  NOT NULL,
//  token INTEGER NOT NULL,
//  used_at VARCHAR(50)  NOT NULL,
//  is_used BOOLEAN DEFAULT FALSE

User.createToken = (
  generatedAt,
  generatedById,
  associatedEmail,
  token,
  expiresAt
) => {
  return db.query(
    "INSERT INTO admin_tokens(generated_at, generated_by_id, associated_email, token, expires_at) VALUES($1,$2,$3,$4, $5)",
    [generatedAt, generatedById, associatedEmail, token, expiresAt]
  );
};

User.findTokenByGeneratedById = (generatedById) => {
  return db.query("SELECT * FROM admin_tokens WHERE generated_by_id = $1", [
    generatedById,
  ]);
};

User.InvalidateAdminToken = (tokenId, usedAt, isUsed) => {
  return db.query(
    "UPDATE admin_tokens SET used_at = $1, is_used = $2 WHERE token_id = $3",
    [usedAt, isUsed, tokenId]
  );
};

User.tokenExpired = (expiresAt) => {
  return new Date(Date.now()) > new Date(expiresAt);
};

module.exports = User;
