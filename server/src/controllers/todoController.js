const Todo = require("../models/todo");

const addTodo = async (req, res) => {
  const { todo } = req.body;
  const { userId } = req.params;
  await Todo.add(userId, todo);
  res.send({ status: "success", message: "Todo added successfully" });
};

module.exports = { addTodo };
