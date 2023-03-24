CREATE DATABASE musdaa_project;

CREATE TABLE users(
 user_id SERIAL PRIMARY KEY,
 first_name VARCHAR(50) NOT NULL,
 last_name VARCHAR(50) NOT NULL,
 email  VARCHAR(50) NOT NULL,
 country VARCHAR(255) NOT NULL,
 tel_number VARCHAR(50) NOT NULL,
 password VARCHAR(200) NOT  NULL,
 user_verify_token VARCHAR(50) NOT NULL,
 is_verified_email BOOLEAN  DEFAULT FALSE,
 user_role VARCHAR(40) NOT NULL,
 UNIQUE(email)
);



CREATE TABLE admin_tokens(
 token_id SERIAL PRIMARY KEY,
 generated_at VARCHAR(50) NOT NULL,
 generated_by_id  VARCHAR(50) NOT NULL,
 associated_email  VARCHAR(50)  NOT NULL,
 token INTEGER NOT NULL,
 expires_at  VARCHAR(50) NOT NULL,
 used_at VARCHAR(50) DEFAULT NULL,
 is_used BOOLEAN DEFAULT FALSE
);


ALTER TABLE admin_tokens ADD COLUMN expires_at VARCHAR(50) NOT NULL;

