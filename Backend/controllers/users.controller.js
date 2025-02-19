const User = require("../models/users.model");

const createUser = async (req, res) => {
  try {
    const { userId, email, displayName } = req.body;
    const user = await User(userId, email, displayName);
    res.json({
      status: 201,
      success: true,
      message: "User created successfully",
      data: user,
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
  createUser,
};
