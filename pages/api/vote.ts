import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(501).end();
  }

  const session = await getSession({ req });

  if (!session) return res.status(401).json({ message: "Not logged in" });

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) return res.status(401).json({ message: "User not found" });

  if (req.method === "POST") {
    const vote = await prisma.vote.upsert({
      where: {
        authorId_videoId: {
          authorId: user.id,
          videoId: req.body.video,
        },
      },
      update: { up: req.body.up },
      create: {
        up: req.body.up,
        video: { connect: { id: req.body.video } },
        author: { connect: { id: user.id } },
      },
    });

    return res.json(vote);
  }

  return res.end();
}
