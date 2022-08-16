import { amount } from "./config";

export const getVideos = async (options, prisma) => {
  const data: { [key: string]: any } = {
    where: {},
    orderBy: [{ createdAt: "desc" }],
    include: { author: true },
  };

  console.log("options.author", options.author);

  if (options.author) {
    data.where = {
      author: {
        id: options.author,
      },
    };
  }

  data.take = options.take || amount;

  if (options.skip) {
    data.skip = options.skip;
  }

  if (options.subscriptions) {
    const user = await prisma.user.findUnique({
      where: { id: options.subscriptions },
      include: { subscribedTo: true },
    });
    data.where = {
      authorId: { in: user.subscribedTo.map((channel) => channel.id) },
    };
  }

  const videos = await prisma.video.findMany(data);

  return videos;
};

export const getVideo = async (id, prisma) => {
  const video = await prisma.video.findUnique({
    where: { id },
    include: { author: true },
  });

  return video;
};

export const getUser = async (username, prisma) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  return user;
};

export const getSubscribersCount = async (username, prisma) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { subscribers: true },
  });

  return user.subscribers.length;
};

export const isSubscribed = async (username, isSubscribedTo, prisma) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      subscribedTo: {
        where: {
          id: isSubscribedTo,
        },
      },
    },
  });

  return user.subscribedTo?.length !== 0;
};

export const getSubscribedTo = async (userId, prisma) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscribedTo: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  });

  return user.subscribedTo.filter(
    (video, index, array) =>
      array.findIndex((obj) => obj.username === video.username) === index
  );
};

export const getSeen = async (userId, prisma) => {
  const videos = await prisma.seen.findMany({
    where: { userId },
  });

  return videos.map((video) => video.videoId);
};
