import { amount } from "./config";

export const getVideos = async (options, prisma) => {
  const data: { [key: string]: any } = {
    where: {},
    orderBy: [{ createdAt: "desc" }],
    include: { author: true },
  };

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

  // console.log("data.ts data.where", data.where);

  const videos = await prisma.video.findMany(data);

  // console.log("data.ts videos", videos);
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

  console.log(user);

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
