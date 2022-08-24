import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Heading from "../../components/Heading";
import LoadMore from "../../components/LoadMore";
import SubscribedButton from "../../components/SubscribedButton";
import Videos from "../../components/Videos";
import { amount } from "../../lib/config";
import {
  getSubscribersCount,
  getUser,
  getVideos,
  isSubscribed,
} from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Channel({
  user,
  initialVideos,
  subscribers,
  subscribed,
}) {
  const [videos, setVideos] = useState(initialVideos);
  const [reachedEnd, setReachedEnd] = useState(initialVideos.length < amount);

  const { data: session, status } = useSession();

  const loading = status === "loading";

  if (loading) {
    return null;
  }
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
              <p className="text-lg font-bold">{user.name}</p>
              <div className="text-gray-400">{subscribers} subscribers</div>
            </div>
          </div>
          <div className="mt-12 mr-5">
            {session && user.id === session?.user?.id && (
              <Link href="/upload">
                <a className="rounded-md bg-green-500 px-3 py-2">
                  Upload new video
                </a>
              </Link>
            )}
            {session && user.id !== session?.user?.id && (
              <SubscribedButton user={user} subscribed={subscribed} />
            )}
          </div>
        </div>
        <div>
          <Videos videos={videos} showUnlisted />

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
  const session = await getSession(context);

  let user = await getUser(context.params.username, prisma);
  user = JSON.parse(JSON.stringify(user));

  let subscribed = false;
  let subscribers = [];
  let videos = [];
  if (user) {
    subscribed = await isSubscribed(session.user.username, user.id, prisma);
    subscribed = JSON.parse(JSON.stringify(subscribed));

    videos = await getVideos({ author: user.id }, prisma);
    videos = JSON.parse(JSON.stringify(videos));

    subscribers = await getSubscribersCount(context.params.username, prisma);
    subscribers = JSON.parse(JSON.stringify(subscribers));
  }

  return {
    props: {
      initialVideos: videos,
      user,
      subscribers,
      subscribed,
    },
  };
}
