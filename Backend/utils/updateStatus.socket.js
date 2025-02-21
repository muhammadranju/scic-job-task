const Task = require("../models/tasks.model");

const updatedTasksStatus = async (socket, io) => {
  socket.on("updateTaskStatus", async ({ taskId, newStatus }) => {
    try {
      console.log(newStatus);
      await Task.findByIdAndUpdate(taskId, { status: newStatus });

      const updatedTasks = await Task.find().sort({ order: -1 });
      io.emit("tasksUpdated", updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};

module.exports = updatedTasksStatus;
