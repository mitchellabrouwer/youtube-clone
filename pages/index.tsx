import Head from "next/head";
import Heading from "../components/Heading";
import Videos from "../components/Videos";
import { getVideos } from "../lib/data";
import prisma from "../lib/prisma";

export default function Home({ videos }) {
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
    </div>
  );
}

export async function getServerSideProps() {
  let videos = await getVideos({}, prisma);
  videos = JSON.parse(JSON.stringify(videos));

  return { props: { videos } };
}
