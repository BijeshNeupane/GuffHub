import { prisma } from "../config/prismaClient.js";
import multer from "multer";
import ImageKit from "imagekit";

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

const upload = multer({ storage: multer.memoryStorage() });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

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

      const image = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${clerkId}_${Date.now()}.jpg`,
        folder: "/profile-images",
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
