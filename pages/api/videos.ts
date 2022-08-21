import { amount } from "../../lib/config";
import { getBestVideos, getVideos } from "../../lib/data";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
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

  return res.end();
}
