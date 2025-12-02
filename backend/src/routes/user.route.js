import express from "express";
import {
  followUser,
  getUserById,
  unFollowUser,
} from "../controller/user.controller.js";
import { verifyUser } from "../middleware/authUser.middleware.js";

const router = express.Router();

router.use(verifyUser);
router.get("/:id", getUserById);
router.post("/follow", followUser);
router.post("/unfollow", unFollowUser);

export default router;
