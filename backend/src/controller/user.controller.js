import { prisma } from "../config/prismaClient.js";
export async function getUserById(req, res) {
  const userId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        followers: true,
        following: true,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get user" });
  }
}

export async function followUser(req, res) {
  const { userAId, userBId } = req.body;
  try {
    await prisma.follow.create({
      data: {
        followerId: userAId,
        followingId: userBId,
      },
    });

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to follow user" });
  }
}

export async function unFollowUser(req, res) {
  const { userAId, userBId } = req.body;
  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: { followerId: userAId, followingId: userBId },
      },
    });

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to follow user" });
  }
}

export async function getUserByUserName(req, res) {
  const { username } = req.params;

  if (!username || username.trim() === "") {
    return res.status(400).json({ error: "Username query is required" });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
      },
      take: 10,
      select: {
        id: true,
        username: true,
        profileImageUrl: true,
      },
    });

    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to search users" });
  }
}

export async function savePostForUser(req, res) {
  const { id: userId } = req.user;
  const { postId } = req.params;

  try {
    const hasSaved = await prisma.postSave.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (hasSaved) {
      return res.status(200).json({ message: "Post already saved" });
    }

    const post = await prisma.postSave.create({
      data: {
        postId,
        userId,
      },
    });

    if (!post) {
      return res.status(500).json({ error: "Failed to save post" });
    }

    res.status(200).json({ message: "Post saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save post" });
  }
}
