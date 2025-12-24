import express from "express";
import { verifyUser } from "../middleware/authUser.middleware.js";

const router = express.Router();

router.use(verifyUser);

router.get("/", (req, res) => {
  return res.json(req.user);
});

export default router;
