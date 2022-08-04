import Head from "next/head";
import { useState } from "react";
import Heading from "../components/Heading";
import LoadMore from "../components/LoadMore";
import Videos from "../components/Videos";
import { amount } from "../lib/config";
import { getVideos } from "../lib/data";
import prisma from "../lib/prisma";

export default function Home({ initialVideos }) {
  const [videos, setVideos] = useState(initialVideos);
  const [reachedEnd, setReachedEnd] = useState(initialVideos.length < amount);

  return (
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
  );
}

export async function getServerSideProps() {
  let videos = await getVideos({}, prisma);
  videos = JSON.parse(JSON.stringify(videos));

  return { props: { initialVideos: videos } };
}
