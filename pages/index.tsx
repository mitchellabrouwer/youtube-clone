import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import Heading from "../components/Heading";
import LoadMore from "../components/LoadMore";
import Videos from "../components/Videos";
import { amount } from "../lib/config";
import { getSeen, getVideos } from "../lib/data";
import prisma from "../lib/prisma";

export default function Home({ initialVideos, watched }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState(initialVideos);
  const [reachedEnd, setReachedEnd] = useState(initialVideos.length < amount);

  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (session && (!session?.user?.name || !session?.user?.image)) {
    router.push("/setup");
  }

  return (
    <ErrorBoundary>
      <div>
        <Head>
          <title>Youtube clone</title>
          <meta name="description" content="a great youtube clone" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {/* <Head>
        <title>Channel of {user.name}</title>
        <meta name="description" content={`Channel of ${user.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
        <Heading />

        {videos.length === 0 && (
          <p className="mt-20 flex justify-center">No videos found</p>
        )}
        <Videos videos={videos} watched={watched} />
        {!reachedEnd && (
          <LoadMore
            videos={videos}
            setVideos={setVideos}
            setReachedEnd={setReachedEnd}
            author={undefined}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  let videos = await getVideos({}, prisma);
  videos = JSON.parse(JSON.stringify(videos));

  const watched = await getSeen(session.user.id, prisma);
  return { props: { initialVideos: videos, watched } };
}
