import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import timeago from "../lib/timeago";

type VideoProps = {
  video: any;
  seen?: string[];
};

const visibilityOptions = ["public", "unlisted", "private"];

export default function Video({ video, seen }: VideoProps) {
  const { data: session } = useSession();

  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState(false);
  const changeVisibility = async (updatedVisibility) => {
    await fetch("/api/videos", {
      body: JSON.stringify({
        video: video.id,
        visibility: updatedVisibility,
      }),

      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    router.reload();
  };

  return (
    <div className="">
      <div className="px-5 pb-5">
        {video.thumbnail && (
          <Link href={`/video/${video.id}`}>
            <a>
              <Image
                className={`mb-2 cursor-pointer ${seen ? "brightness-50" : ""}`}
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
        {seen && (
          <p className="relative float-left -mt-11 ml-1 bg-black p-1 italic text-white">
            viewed
          </p>
        )}
        <div className="flex justify-between">
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
          {session.user.id === video.authorId && (
            <button
              id="dropdownDefault"
              data-dropdown-toggle="dropdown"
              className="relative inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {video.visibility}
              <svg
                className="ml-2 h-4 w-4"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>

              <div
                id="dropdown"
                className={`${
                  showDropdown ? "" : "hidden"
                } absolute top-[100%] left-0 z-10 mt-1 w-24 divide-y divide-gray-100 rounded bg-white shadow dark:bg-gray-700`}
              >
                <ul
                  className="py-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefault"
                >
                  {visibilityOptions
                    .filter((option) => option !== video.visibility)
                    .map((option) => (
                      <li>
                        <a
                          href="#"
                          className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          onClick={() => changeVisibility(option)}
                        >
                          {option}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
