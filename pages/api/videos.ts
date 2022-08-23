import { amount } from "../../lib/config";
import { getBestVideos, getVideos } from "../../lib/data";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  console.log("here");
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(501).end();
  }

  if (req.method === "GET") {
    const take = parseInt(req.query.take || amount, 10);
    const skip = parseInt(req.query.skip || 0, 10);
    const { author, subscriptions, trending } = req.query;

    let videos;
    if (trending) {
      videos = await getBestVideos(skip, take, prisma);
    } else {
      videos = await getVideos({ take, skip, author, subscriptions }, prisma);
    }

    return res.json(videos);
  }

  if (req.method === "POST") {
    console.log("req.body.visibility", req.body.visibility);
    if (req.body.visibility && req.body.video) {
      const update = await prisma.video.update({
        where: { id: req.body.video },
        data: { visibility: req.body.visibility },
      });

      console.log("update", update);

      return res.json(!!update);
    }
  }

  return res.end();
}
