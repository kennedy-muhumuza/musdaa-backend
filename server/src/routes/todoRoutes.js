const express = require("express");
const { addTodo } = require("../controllers/todoController");
const { verifyToken } = require("../utils/verifyToken");

const router = express.Router();

router.post("/add-todo/:userId", verifyToken, addTodo);

module.exports = router;
