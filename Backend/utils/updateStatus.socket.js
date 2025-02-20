const Task = require("../models/tasks.model");

const updatedTasksStatus = async (socket, io) => {
  socket.on("updateTaskStatus", async ({ taskId, newStatus }) => {
    await Task.findByIdAndUpdate(taskId, { status: newStatus });

    const updatedTasks = await Task.find().sort({ order: -1 });
    io.emit("tasksUpdated", updatedTasks); // Send updated task list to all clients
  });

  socket.on("reorderTask", async ({ taskId }) => {
    const task = await Task.findById(taskId);
    if (!task) return;

    // Move the clicked task to the top of its column
    await Task.updateMany(
      { status: task.status },
      { $inc: { order: -1 } } // Move all tasks down by 1
    );

    await Task.findByIdAndUpdate(taskId, { order: Date.now() }); // Assign a high order value

    const updatedTasks = await Task.find().sort({ order: -1 });
    io.emit("tasksUpdated", updatedTasks);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};

module.exports = updatedTasksStatus;
