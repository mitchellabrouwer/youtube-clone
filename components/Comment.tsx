/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import Link from "next/link";
import timeago from "../lib/timeago";

export default function Comment({ comment }) {
  return (
    <div className="mt-6 flex flex-row">
      <div className="mb-4 justify-center px-10">
        <p>
          <Link href={`/channel/${comment.author.username}`}>
            <a className="underline">{comment.author.name}</a>
          </Link>
          {` ${timeago.format(new Date(comment.createdAt))}`}
        </p>
        <p>{comment.content}</p>
      </div>
    </div>
  );
}
