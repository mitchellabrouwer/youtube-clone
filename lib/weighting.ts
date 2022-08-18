const WEIGHTS = {
  likes: { benefit: true, weight: 0.25 },
  dislikes: { benefit: false, weight: 0.25 },
  views: { benefit: true, weight: 0.15 },
  comments: { benefit: true, weight: 0.35 },
};

export const getBestVideos = async (options, prisma) => {
  // const votes = prisma.vote.findMany({});
  const videos = await prisma.video.findMany({
    include: { votes: true, comments: true },
  });

  console.log(videos);
  return videos;
};
