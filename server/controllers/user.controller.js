import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/lisiting.model.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id != req.params.id)
    return next(errorHandler(403, "Denied access!!! Not your  account!!!"));
  try {
    if (req.body.password)
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id != req.params.id)
    return next(errorHandler(403, "Denied access!!! Not your  account!!!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    next();
  } catch (error) {
    next(error);
  }
};

export const getUserLisitng = async (req, res, next) => {
  if (req.user.id != req.params.id)
    return next(errorHandler(403, "Denied access!!! Not your  account!!!"));
  try {
    const lisitngs = await Listing.find({ userRef: req.params.id });
    res.status(200).json(lisitngs);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found !!!!"));
    const { email, ...rest } = user._doc;
    res.status(200).json({ email });
  } catch (error) {
    next(error);
  }
};
