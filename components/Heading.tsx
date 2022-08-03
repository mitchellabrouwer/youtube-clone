import Link from "next/link";
import { useRouter } from "next/router";

export default function Heading() {
  const router = useRouter();

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

      <div className="ml-10 mt-1 grow"></div>
    </header>
  );
}
