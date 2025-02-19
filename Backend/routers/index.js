const router = require("express").Router();

const tasks = require("./tasks.routes");
const users = require("./users.routes");
router.get("/", (_req, res) => {
  res.json({
    status: 200,
    success: true,
    message: "Welcome to the Task Management Application!",
  });
});
router.use("/tasks", tasks);
router.use("/users", users);

module.exports = router;
