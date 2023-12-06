import express from "express";
import {
  createListing,
  deleteListing,
  getLisitng,
  listingSerach,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, createListing);
router.post("/update/:id", verifyUser, updateListing);
router.delete("/:id", verifyUser, deleteListing);
router.get("/", listingSerach);
router.get("/:id", getLisitng);

export default router;
