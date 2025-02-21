const router = require("express").Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskById,
} = require("../controllers/tasks.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
