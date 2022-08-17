import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Heading from "../components/Heading";
import LoadMore from "../components/LoadMore";
import Videos from "../components/Videos";
import { amount } from "../lib/config";
import { getSubscribedTo, getVideos } from "../lib/data";
import prisma from "../lib/prisma";

export default function Subscriptions({ initialVideos, subscribedTo }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [videos, setVideos] = useState(initialVideos);
  const [reachedEnd, setReachedEnd] = useState(initialVideos.length < amount);

  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (session && !session.user.name) {
    router.push("/setup");
  }

  return (
    <div>
      <Head>
        <title>YouTube Clone</title>
        <meta name="description" content="A great YouTube Clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading />

      {videos.length === 0 && (
        <p className="mt-20 flex justify-center">No videos found!</p>
      )}

      <div className="fixed w-1/3">
        <div className="flex flex-col flex-wrap p-5">
          {subscribedTo &&
            subscribedTo.map((user) => (
              <Link href={`/channel/${user.username}`}>
                <a className="mr-2 cursor-pointer underline">{user.name}</a>
              </Link>
            ))}
        </div>
      </div>

      <div className="ml-[20%]">
        <Videos videos={videos} />

        {!reachedEnd && (
          <LoadMore
            videos={videos}
            setVideos={setVideos}
            setReachedEnd={setReachedEnd}
            subscriptions={session.user.id}
          />
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  let videos = await getVideos({ subscriptions: session.user.id }, prisma);
  videos = JSON.parse(JSON.stringify(videos));

  let subscribedTo = await getSubscribedTo(session.user.id, prisma);
  subscribedTo = JSON.parse(JSON.stringify(subscribedTo));

  return { props: { initialVideos: videos, subscribedTo } };
}
