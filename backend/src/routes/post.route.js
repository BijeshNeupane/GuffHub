import express from "express";
import {
  commentPost,
  createPost,
  getPosts,
  getPostsById,
  likePost,
} from "../controller/post.controller.js";
import upload from "../lib/multer.js";
import { verifyUser } from "../middleware/authUser.middleware.js";

const router = express.Router();

router.use(verifyUser);

router.get("/", getPosts);
router.get("/:id", getPostsById);
router.post("/create", upload.any(), createPost);
router.post("/like", likePost);
router.post("/comment/:id", commentPost);

export default router;
