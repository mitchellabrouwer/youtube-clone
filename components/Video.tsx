import Image from "next/image";
import Link from "next/link";
import timeago from "../lib/timeago";

export default function Video({ video }) {
  return (
    <div className="">
      <div className="px-5 pb-5">
        {video.thumbnail && (
          <Link href={`/video/${video.id}`}>
            <a>
              <Image
                className="mb-2 cursor-pointer"
                src={video.thumbnail}
                width="800"
                height="450"
              />
            </a>
          </Link>
        )}
        <p className="relative float-right -mt-11 mr-1 bg-black p-1 text-white">
          {Math.floor(video.length / 60)
            .toString()
            .padStart(2, "0")}
          :{(video.length % 60).toString().padStart(2, "0")}
        </p>
        <div className="flex">
          {video.author.image && (
            // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
            <img
              className="mt-2 mr-2 h-10 w-10 rounded-full"
              src={video.author.image}
            />
          )}
          <div>
            <Link href={`/video/${video.id}`}>
              <a className="text-lg font-bold text-white">{video.title}</a>
            </Link>
            <div className="">
              <div className="">
                <div className="text-gray-400">
                  <Link href={`/channel/${video.author.username}`}>
                    <a className="mr-2 cursor-pointer underline">
                      {video.author.name}
                    </a>
                  </Link>
                  · {video.views} views ·{" "}
                  {timeago.format(new Date(video.createdAt))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
