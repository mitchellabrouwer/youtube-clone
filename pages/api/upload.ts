import { NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nextConnect from "next-connect";
import prisma from "../../lib/prisma";
import { upload } from "../../lib/upload";
import middleware from "../../middleware/middleware";
import { Request } from "../../types/general";

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req: Request, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) return res.status(401).json({ message: "User not found" });

  const video = await prisma.video.create({
    data: {
      title: req.body.title[0],
      visibility: "public",
      length: parseInt(req.body.duration[0], 10),
      thumbnail: "",
      url: "",
      author: { connect: { id: user.id } },
    },
  });

  if (req.files) {
    const thumbnailUrl = await upload({
      file: req.files.image[0],
      userId: user.id,
    });

    const videoUrl = await upload({
      file: req.files.video[0],
      userId: user.id,
    });

    await prisma.video.update({
      where: { id: video.id },
      data: { thumbnail: thumbnailUrl, url: videoUrl },
    });
  }

  return res.end();
});

export const config = { api: { bodyParser: false } };

export default handler;
