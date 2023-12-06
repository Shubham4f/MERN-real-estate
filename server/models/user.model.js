import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=1060&t=st=1699697530~exp=1699698130~hmac=1869b8f1f3dcd09eba252371ec93664224fc2c42e082ed9b68a46ad92bf8e80f",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
