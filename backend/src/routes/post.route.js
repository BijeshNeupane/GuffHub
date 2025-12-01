import express from "express";
import { createPost, getPosts } from "../controller/post.controller.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/create", upload.any(), createPost);

export default router;
