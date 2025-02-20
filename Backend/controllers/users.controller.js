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
    const { userId, email, displayName } = req.body;
    console.log(email);
    const user = await User.findOne({ email });

    if (!user) {
      const newUser = await User({ userId, email, displayName });
      await newUser.save();

      const payload = {
        userId: newUser._id,
        email: newUser.email,
        displayName: newUser.displayName,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({
        status: 201,
        success: true,
        message: "User created successfully",
        data: {
          token,
          newUser,
        },
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

    return res.json({
      status: 200,
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user,
      },
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

module.exports = {
  createUser,
  userLogin,
};
