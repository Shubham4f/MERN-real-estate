import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully!" });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { username } = req.body;
  try {
    const validUser = await User.findOne({ username });
    if (!validUser) return next(errorHandler(401, "Wrong credentials!!!"));
    const validPassword = bcryptjs.compareSync(
      req.body.password,
      validUser.password
    );
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!!!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      message: "User signed out.",
    });
  } catch (error) {
    next(error);
  }
};
