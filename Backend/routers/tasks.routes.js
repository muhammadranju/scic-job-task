const router = require("express").Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/tasks.controller");

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
