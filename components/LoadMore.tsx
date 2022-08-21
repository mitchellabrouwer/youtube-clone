import { amount } from "../lib/config";

export default function LoadMore({
  videos,
  setVideos,
  setReachedEnd,
  author,
  subscriptions,
  trending,
}) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        className="my-10 mr-2 rounded-full border px-8 py-2 font-bold"
        onClick={async () => {
          let url = `/api/videos?skip=${videos.length}`;

          if (author) {
            url += `&author=${author.id}`;
          }

          if (subscriptions) {
            url += `&subscriptions=${subscriptions}`;
          }

          if (trending) {
            url += `&trending=${!!trending}`;
          }

          const res = await fetch(url);
          const data = await res.json();
          if (data.length < amount) {
            setReachedEnd(true);
          }
          setVideos([...videos, ...data]);
        }}
      >
        Load More
      </button>
    </div>
  );
}
