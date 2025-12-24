import express from "express";
import {
  commentPost,
  createPost,
  getAllComment,
  getPosts,
  getPostsById,
  getSavedPostsForUser,
  likePost,
} from "../controller/post.controller.js";
import upload from "../lib/multer.js";
import { verifyUser } from "../middleware/authUser.middleware.js";

const router = express.Router();

router.use(verifyUser);

router.get("/", getPosts);
router.get("/:id", getPostsById);
router.get("/saved/:id", getSavedPostsForUser);
router.post("/create", upload.any(), createPost);
router.post("/like", likePost);
router.post("/comment/:id", commentPost);
router.get("/getAllComment/:id", getAllComment);

export default router;
