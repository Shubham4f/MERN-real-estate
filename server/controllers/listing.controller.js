import Listing from "../models/lisiting.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  if (req.user.id != req.body.userRef)
    return next(errorHandler(403, "Denied access!!! Not your  account!!!"));
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const lisiting = await Listing.findById(req.params.id);
    if (!lisiting) return next(errorHandler(404, "Listing not found!!!"));
    if (req.user.id != lisiting.userRef)
      return next(errorHandler(403, "Denied access!!! Not your  account!!!"));
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Lisitng deleted!" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const lisiting = await Listing.findById(req.params.id);
    if (!lisiting) return next(errorHandler(404, "Listing not found!!!"));
    if (req.user.id != lisiting.userRef)
      return next(errorHandler(403, "Denied access!!! Not your  account!!!"));
    const updatedLisitng = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedLisitng);
  } catch (error) {
    next(error);
  }
};

export const getLisitng = async (req, res, next) => {
  try {
    const lisiting = await Listing.findById(req.params.id);
    if (!lisiting) return next(errorHandler(404, "Lisitng not found!!!"));
    res.status(200).json(lisiting);
  } catch (error) {
    next(error);
  }
};

export const listingSerach = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sell"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const lisitings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json(lisitings);
  } catch (error) {
    next(error);
  }
};
