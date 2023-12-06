import express from "express";
import {
  updateUser,
  deleteUser,
  getUserLisitng,
  getUser,
} from "../controllers/user.controller.js";
import { signOut } from "../controllers/auth.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser, signOut);
router.get("/listings/:id", verifyUser, getUserLisitng);
router.get("/:id", verifyUser, getUser);

export default router;
