import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(501).end();
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) return res.status(401).json({ message: "User not found" });

  if (req.method === "POST") {
    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        author: { connect: { id: session.user.id } },
        video: { connect: { id: req.body.video } },
      },
    });

    return res.json(comment);
  }

  return res.end();
}
