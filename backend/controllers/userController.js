const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.send({success:false, message: "Enter all fields" });
  }

  const hashedPassword = await hashPassword(password);

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.send({
      success: false,
      message: "Already Registered Please Login",
    });
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    pic,
  });
  if (user) {
    res.status(201).json({
      success:true,
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Error in Registration",
    });
  }
});

const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await comparePassword(password, user.password))) {
    res.json({
      success:true,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.json({
      success: false,
      message:"Invalid Email or Password"
    });
  }
};


//  /api/user?search=pankaj
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
  
})

module.exports = { registerUser,authUser,allUsers };
