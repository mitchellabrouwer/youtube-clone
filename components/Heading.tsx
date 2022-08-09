/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Heading() {
  const router = useRouter();

  const { data: session, status } = useSession();

  const loading = status === "loading";

  if (loading) {
    return null;
  }

  return (
    <header className="flex h-14 px-5 pt-5 pb-2">
      <div className="text-xl">
        {router.asPath === "/" ? (
          <p>Youtube clone</p>
        ) : (
          <Link href="/">
            <a className="underline">Home</a>
          </Link>
        )}
      </div>

      <div className="ml-10 mt-1 grow">
        {session &&
          (router.asPath === "/subscriptions" ? (
            <a className="flex">
              <p className="mr-3 font-bold">Subscriptions</p>
            </a>
          ) : (
            <Link href="/subscriptions">
              <a className="flex">
                <p className="mr-3 underline">Subscriptions</p>
              </a>
            </Link>
          ))}
      </div>

      {session && (
        <Link href={`/channel/${session.user.username}`}>
          <a className="flex">
            <img
              src={session.user.image}
              className="mr-2 mb-2 mt-1 h-8 rounded-full"
            />
            <p className="mr-3">{session.user.name}</p>
          </a>
        </Link>
      )}

      <a
        className="flex-l rounded-full border px-4 font-bold"
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
      >
        {session ? "logout" : "login"}
      </a>
    </header>
  );
}
