import { prisma } from "../config/prismaClient.js";

import imagekit from "../lib/imagekit.js";
import upload from "../lib/multer.js";

export async function checkUserExistence(req, res) {
  const { clerkId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (user) {
      return res.status(200).json({ exists: true, user });
    }
    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}

export const registerUser = [
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { username, fullName, clerkId } = req.body;

      if (!username || !clerkId) {
        return res
          .status(400)
          .json({ error: "Username and clerkId are required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Profile image is required" });
      }

      // --- PROCESS IMAGE HERE ---
      const processedImage = await sharp(req.file.buffer)
        .rotate() // fixes iPhone orientation
        .resize({
          width: 1080,
          height: 1080,
          fit: "inside", // keeps aspect ratio
        })
        .jpeg({ quality: 80 }) // compress to optimized JPG
        .toBuffer();

      const image = await imagekit.upload({
        file: processedImage.toString("base64"),
        fileName: `${clerkId}_${Date.now()}.jpg`,
        folder: "/profile-images",
        fileType: "image",
      });

      const newUser = await prisma.user.create({
        data: {
          clerkId,
          username,
          fullName,
          profileImageUrl: image.url,
        },
      });

      return res.status(201).json(newUser);
    } catch (err) {
      console.error("Error registering user:", err);
      return res
        .status(500)
        .json({ error: err.message || "Failed to create user" });
    }
  },
];
