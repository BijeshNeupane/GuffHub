import express from "express";
import { createPost, getPosts } from "../controller/post.controller.js";
import upload from "../lib/multer.js";
import { verifyUser } from "../middleware/authUser.middleware.js";

const router = express.Router();

router.use(verifyUser);

router.get("/", getPosts);
router.post("/create", upload.any(), createPost);

export default router;
