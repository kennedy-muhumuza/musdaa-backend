CREATE DATABASE form_auth;

CREATE TABLE users(
 user_id SERIAL PRIMARY KEY,
 first_name VARCHAR(50) NOT NULL,
 last_name VARCHAR(50) NOT NULL,
 email  VARCHAR(50) NOT NULL,
 password VARCHAR(200) NOT  NULL,
 UNIQUE(email)
);

