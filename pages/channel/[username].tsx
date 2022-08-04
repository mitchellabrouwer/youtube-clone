import Head from "next/head";
import { useState } from "react";
import Heading from "../../components/Heading";
import LoadMore from "../../components/LoadMore";
import Videos from "../../components/Videos";
import { amount } from "../../lib/config";
import { getUser, getVideos } from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Channel({ user, initialVideos }) {
  const [videos, setVideos] = useState(initialVideos);
  const [reachedEnd, setReachedEnd] = useState(initialVideos.length < amount);

  if (!user)
    return <p className="p-5 text-center">Channel does not exist 😞</p>;

  return (
    <>
      <Head>
        <title>{user.name}</title>
        <meta name="description" content={user.name} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading />
      <div>
        <div className="flex justify-between">
          <div className="m-5 flex">
            {user.image && (
              // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
              <img
                className="mt-2 mr-2 h-20 w-20 rounded-full"
                src={user.image}
              />
            )}
            <div className="mt-5">
              <p className="text-lg font-bold text-white">{user.name}</p>
            </div>
          </div>
        </div>
        <div>
          <Videos videos={videos} />

          {!reachedEnd && (
            <LoadMore
              videos="videos"
              setVideos={setVideos}
              setReachedEnd={setReachedEnd}
              author={user}
            />
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let user = await getUser(context.params.username, prisma);
  user = JSON.parse(JSON.stringify(user));

  let videos = await getVideos({ author: user.id }, prisma);
  videos = JSON.parse(JSON.stringify(videos));

  return {
    props: {
      initialVideos: videos,
      user,
    },
  };
}
