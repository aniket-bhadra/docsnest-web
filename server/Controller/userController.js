const User = require("../models/userModel.js");

const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  try {
    if (!name || !email || !password) {
      const error = new Error("Please Enter all the Fields");
      error.statusCode = 400;
      throw error;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      const error = new Error("Please Enter all the Fields");
      error.statusCode = 400;
      throw error;
    }
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
      });
    } else {
      const error = new Error("Invalid Email or Password");
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
