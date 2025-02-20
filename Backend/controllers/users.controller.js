const User = require("../models/users.model");
const jwt = require("jsonwebtoken");

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

const userLogin = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "User not found",
      });
    }

    const payload = {
      userId: user._id,
      email: user.email,
      displayName: user.displayName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      status: 200,
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user,
      },
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
  userLogin,
};
