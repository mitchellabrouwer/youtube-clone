import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(501).end();
  }

  const session = await getSession({ req });
  let user;
  if (session) {
    user = await prisma.user.findUnique({ where: { id: session.user.id } });
  }

  console.log("req.body.video", req.body.video);

  console.log("user", user);

  if (req.method === "POST" && req.body.video) {
    await prisma.video.update({
      where: { id: req.body.video },
      data: { views: { increment: 1 } },
    });

    if (user) {
      await prisma.seen.upsert({
        where: {
          userId_videoId: {
            userId: user.id,
            videoId: req.body.video,
          },
        },
        create: {
          userId: user.id,
          videoId: req.body.video,
        },
        update: {},
      });
    }
  }

  return res.end();
}
