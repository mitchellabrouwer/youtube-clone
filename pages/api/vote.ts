import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(501).end();
  }

  const session = await getSession({ req });
  let user;

  if (session) {
    user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
  }

  if (req.method === "GET") {
    let vote;

    if (user?.id) {
      vote = await prisma.vote.findUnique({
        where: {
          authorId_videoId: {
            authorId: user.id,
            videoId: req.query.video,
          },
        },
      });
    }

    const downvotes = await prisma.vote.count({
      where: { up: false },
    });

    const upvotes = await prisma.vote.count({
      where: { up: true },
    });

    return res.json({
      vote: vote || null,
      downvotes,
      upvotes,
    });
  }

  if (req.method === "POST") {
    if (!session) return res.status(401).json({ message: "Not logged in" });

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
