import dynamic from "next/dynamic";

import Link from "next/link";
import { Key } from "react";
import Video from "../../components/Video";
import { getVideo, getVideos } from "../../lib/data";
import prisma from "../../lib/prisma";
import timeago from "../../lib/timeago";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export default function SingleVideo({ video, videos }) {
  if (!video) return <p className="p-5 text-center">Video does not exist 😞</p>;

  return (
    <>
      <header className="flex h-14 px-5 pt-5 pb-2">
        <Link href="/">
          <a className="underline">Home</a>
        </Link>

        <div className="grow"></div>
      </header>

      <div className="flex h-screen">
        <div className="border-3 mb-4 flex w-full flex-col border-t border-r border-b border-black bg-black pl-0 md:w-2/3">
          <div className="relative pt-[60%]">
            <ReactPlayer
              className="react-player absolute top-0 left-0"
              url={video.url}
              width="100%"
              height="100%"
              controls
              // light={video.thumbnail}
            />
          </div>

          <div className="mt-5 px-5">
            <div className="flex ">
              <div>
                <p className="text-2xl font-bold ">{video.title}</p>

                <div className="text-gray-400">
                  {video.views} views ·{" "}
                  {timeago.format(new Date(video.createdAt))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-between border-t border-gray-500 pt-5">
              <Link href={`/channel/${video.author.username}`}>
                <a className=" flex ">
                  {video.author.image && (
                    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
                    <img
                      className="mt-2 mr-2 h-16 w-16 rounded-full"
                      src={video.author.image}
                    />
                  )}
                  <span className="mt-6 ml-2 text-xl">{video.author.name}</span>
                </a>
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:block md:w-1/3">
          <div className="flex flex-wrap">
            {/* eslint-disable-next-line no-shadow */}
            {videos.map((video: any, index: Key) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="w-full" key={index}>
                <Video video={video} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let video = await getVideo(context.params.id, prisma);
  video = JSON.parse(JSON.stringify(video));

  let videos = await getVideos({ take: 3 }, prisma);
  videos = JSON.parse(JSON.stringify(videos));

  return {
    props: {
      video,
      videos,
    },
  };
}
