import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import Heading from "../components/Heading";
import LoadMore from "../components/LoadMore";
import Videos from "../components/Videos";
import { amount } from "../lib/config";
import { getVideos } from "../lib/data";
import prisma from "../lib/prisma";

export default function Home({ initialVideos }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState(initialVideos);
  const [reachedEnd, setReachedEnd] = useState(initialVideos.length < amount);

  const loading = status === "loading";

  if (loading) {
    return null;
  }

  console.log("image", !session.user.image);
  console.log("name", !session.user.name);
  console.log("session", session);

  if (session && (!session.user.name || !session.user.image)) {
    router.push("/setup");
  }
  // console.log("videos", videos);
  console.log("reachedEnd", reachedEnd);
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
        <Videos videos={videos} />
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

export async function getServerSideProps() {
  let videos = await getVideos({}, prisma);
  videos = JSON.parse(JSON.stringify(videos));

  return { props: { initialVideos: videos } };
}
