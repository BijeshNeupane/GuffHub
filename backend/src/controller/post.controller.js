import { prisma } from "../config/prismaClient.js";
import imagekit from "../lib/imagekit.js";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

export async function createPost(req, res) {
  try {
    const { description, userId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images received" });
    }

    // Upload all files to ImageKit
    const uploads = await Promise.all(
      req.files.map(async (file) => {
        // Resize & compress BEFORE uploading
        const processedImage = await sharp(file.buffer)
          .rotate() // fix orientation from EXIF
          .resize({
            width: 1080,
            height: 1080,
            fit: "inside", // maintain aspect ratio
          })
          .jpeg({ quality: 80 }) // compress
          .toBuffer();

        // Upload compressed version
        return imagekit.upload({
          file: processedImage.toString("base64"),
          fileName: `${uuidv4()}_${userId}_${file.originalname}`,
          folder: "/posts",
          fileType: "image",
        });
      })
    );

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

    res.status(200).json({ "posts": posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
}

export async function likePost(req, res) {
  const { postId, userId } = req.body;
  try {
    const hasLiked = await prisma.postLike.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (hasLiked) {
      const like = await prisma.postLike.delete({
        where: {
          id: hasLiked.id,
        },
      });

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          likes: {
            select: {
              userId: true,
            },
          },
        },
      });
      return res.status(200).json(post);
    }

    const like = await prisma.postLike.create({
      data: {
        postId,
        userId,
      },
    });
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to like post" });
  }
}

export async function getPostsById(req, res) {
  const { id } = req.params;
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: id,
      },
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

    res.status(200).json({ "posts": posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
}

export async function commentPost(req, res) {
  const { id } = req.params;

  try {
    const { content, userId } = req.body;
    const comment = await prisma.comment.create({
      data: {
        text: content,
        userId: userId,
        postId: id,
      },
    });

    if (!comment) {
      return res.status(500).json({ error: "Failed to comment post" });
    }
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to comment post" });
  }
}

export async function getAllComment(req, res) {
  const { id } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: id,
      },
      include: {
        user: {
          select: {
            username: true,
            profileImageUrl: true,
          },
        },
      },
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get comments" });
  }
}
