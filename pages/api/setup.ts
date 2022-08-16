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

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: req.body.name[0],
      username: req.body.username[0],
    },
  });

  if (req.files && req.files.image[0]) {
    const avatarUrl = await upload({
      file: req.files.image[0],
      userId: user.id,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { image: avatarUrl },
    });
  }

  return res.end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
