const router = require("express").Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/tasks.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
