import Link from "next/link";
import Videos from "../../components/Videos";
import { getUser, getVideos } from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Channel({ user, videos }) {
  if (!user)
    return <p className="p-5 text-center">Channel does not exist 😞</p>;

  return (
    <>
      <header className="flex h-14 px-5 pt-5 pb-2">
        <Link href="/">
          <a className="underline">Home</a>
        </Link>

        <div className="grow"></div>
      </header>
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
      videos,
      user,
    },
  };
}
