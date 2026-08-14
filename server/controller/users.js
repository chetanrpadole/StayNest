import User from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }
    const newUser = new User({ username });
    const registeredUser = await User.register(newUser, password);
    const token = generateToken(registeredUser);
    res.status(201).json({
      success: true,
      message: "Welcome to StayNest!",
      token,
      user: { id: registeredUser._id, username: registeredUser.username },
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    const { user: authenticatedUser } = await user.authenticate(password);
    if (!authenticatedUser) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    const token = generateToken(authenticatedUser);
    res.json({
      success: true,
      message: "Welcome back to StayNest!",
      token,
      user: { id: authenticatedUser._id, username: authenticatedUser.username },
    });
  } catch (e) {
    res.status(401).json({ success: false, message: "Invalid username or password" });
  }
};

export const getCurrentUser = async (req, res) => {
  res.json({
    success: true,
    user: { id: req.user._id, username: req.user.username },
  });
};
