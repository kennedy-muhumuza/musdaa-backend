const db = require("../db/config");

const Todo = {};

Todo.add = (userId, todo) => {
  return db.query("INSERT INTO todos(user_id, todo) VALUES($1, $2)", [
    userId,
    todo,
  ]);
};

module.exports = Todo;
