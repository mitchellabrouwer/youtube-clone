// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import prisma from "../../lib/prisma";

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

    const users = await prisma.user.findMany();
    const getRandomUser = () => {
      const randomIndex = Math.floor(Math.random() * users.length);
      return users[randomIndex];
    };

    let videosCount = 0;

    while (videosCount < 20) {
      // eslint-disable-next-line no-await-in-loop
      await prisma.video.create({
        data: {
          title: faker.lorem.words(),
          thumbnail: thumbnailURL,
          url: videoURL,
          length: faker.datatype.number(1000),
          visibility: "public",
          author: { connect: { id: getRandomUser().id } },
        },
      });
      videosCount += 1;
    }
  }
  if (req.body.task === "clean_database") {
    await prisma.user.deleteMany({});
  }
  return res.end();
}
