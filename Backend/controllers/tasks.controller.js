const Task = require("../models/tasks.model");

const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task({
      title,
      description,
      status,
      userId: req.user.userId,
    });

    await task.save();

    res.status(201).json({
      status: 201,
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks

    // Categorize tasks into "To-Do", "In Progress", and "Done"
    const categorizedTasks = {
      TODO: tasks.filter((task) => task.status === "TODO"),
      IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
      Done: tasks.filter((task) => task.status === "DONE"),
    };

    res.status(200).json({
      status: 200,
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.json({
      status: 200,
      success: true,
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    console.log(req.body);

    // const findTask = await Task.findById({ _id: req.params.id });
    // findTask.status = req.body.status;
    // console.log(findTask);
    const task = await Task.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    return res.json({
      status: 200,
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.json({
      status: 204,
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
