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
  } catch (error) {}
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
