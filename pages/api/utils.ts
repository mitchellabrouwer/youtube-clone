/* eslint-disable no-await-in-loop */
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import prisma from "../../lib/prisma";

const getRandomVideoId = async () => {
  const videos = await prisma.video.findMany();
  const randomIndex = Math.floor(Math.random() * videos.length);
  return videos[randomIndex].id;
};

const getRandomUserId = async () => {
  const users = await prisma.user.findMany();
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex].id;
};

const getRandomBool = () => Math.random() < 0.5;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.end();
  }

  if (req.body.task === "generate_content") {
    let usersCount = 0;
    while (usersCount < 10) {
      // eslint-disable-next-line no-await-in-loop
      await prisma.user.create({
        data: {
          name: faker.name.findName(),
          username: faker.internet.userName().toLowerCase(),
          email: faker.internet.email().toLowerCase(),
          image: faker.image.avatar(),
        },
      });
      usersCount += 1;
    }

    // const s3 = new AWS.S3({
    //   accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    // });

    const videoURL =
      "https://bootcamp-mitch.s3.ap-southeast-2.amazonaws.com/SampleVideo_1280x720_5mb.mp4";
    const thumbnailURL = "http://placeimg.com/800/450/animals";

    let videosCount = 0;

    while (videosCount < 20) {
      await prisma.video.create({
        data: {
          title: faker.lorem.words(),
          thumbnail: thumbnailURL,
          url: videoURL,
          views: faker.datatype.number({
            min: 5,
            max: 100000,
          }),
          length: faker.datatype.number(1000),
          visibility: "public",
          author: { connect: { id: await getRandomUserId() } },
        },
      });
      videosCount += 1;

      let commentsCount = 0;

      while (commentsCount < 20) {
        await prisma.comment.create({
          data: {
            content: faker.lorem.words(),
            author: { connect: { id: await getRandomUserId() } },
            video: { connect: { id: await getRandomVideoId() } },
          },
        });

        commentsCount += 1;
      }

      let votesCount = 0;

      while (votesCount < 100) {
        const author = await getRandomUserId();
        const video = await getRandomVideoId();
        await prisma.vote.upsert({
          where: {
            authorId_videoId: {
              authorId: author,
              videoId: video,
            },
          },
          update: { up: getRandomBool() },
          create: {
            up: getRandomBool(),
            video: { connect: { id: video } },
            author: { connect: { id: author } },
          },
        });

        votesCount += 1;
      }
    }
  }
  if (req.body.task === "clean_database") {
    await prisma.user.deleteMany({});
  }
  return res.end();
}
