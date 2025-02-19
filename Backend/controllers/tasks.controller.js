const Task = require("../models/tasks.model");

const createTask = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const task = await Task({
      title,
      description,
      category,
      userId: req.user.userId,
    });

    await task.save();

    res.status(201).json({
      status: 201,
      success: true,
      message: "Task created successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.userId,
    });
    res.json({
      status: 200,
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
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
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({
      status: 200,
      success: true,
      message: "Task updated successfully",
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
