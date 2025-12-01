import { prisma } from "../config/prismaClient.js";
import imagekit from "../lib/imagekit.js";
import { v4 as uuidv4 } from "uuid";

export async function createPost(req, res) {
  try {
    const { description, userId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images received" });
    }

    // Upload all files to ImageKit
    const uploads = await Promise.all(
      req.files.map((file) =>
        imagekit.upload({
          file: file.buffer,
          fileName: `${uuidv4()}_${userId}_${file.originalname}`,
          folder: "/posts",
        })
      )
    );

    // Create new post (replace authorId with your actual auth logic)
    const post = await prisma.post.create({
      data: {
        content: description,
        authorId: userId,
        media: {
          create: uploads.map((u) => ({
            imageUrl: u.url,
          })),
        },
      },
      include: { media: true },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
}

export async function getPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        media: true,
        author: {
          select: {
            username: true,
            profileImageUrl: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: { likes: true, comments: true, saves: true },
        },
      },
    });

    console.log(posts);

    res.status(200).json({ "posts": posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
}
