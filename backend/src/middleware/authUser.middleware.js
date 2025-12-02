import { prisma } from "../config/prismaClient.js";

export const verifyUser = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const userId = auth.split(" ")[1];

    // Check user in DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user if needed later
    req.user = user;

    return next();
  } catch (err) {
    console.error("verifyUser error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
