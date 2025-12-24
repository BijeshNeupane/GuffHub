import express from "express";
import {
  followUser,
  getUserById,
  getUserByUserName,
  savePostForUser,
  unFollowUser,
} from "../controller/user.controller.js";
import { verifyUser } from "../middleware/authUser.middleware.js";

const router = express.Router();

router.use(verifyUser);
router.get("/:id", getUserById);
router.post("/follow", followUser);
router.post("/unfollow", unFollowUser);
router.get("/search/:username", getUserByUserName);
router.post("/post/save/:postId", savePostForUser);

export default router;
