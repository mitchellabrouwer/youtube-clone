import { useRouter } from "next/router";
import { useState } from "react";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";

export default function Vote({ video, vote, downvotes, upvotes }) {
  // api to create

  const router = useRouter();
  const [isLiked, setIsLiked] = useState(vote);

  async function voteHandler(upvote) {
    await fetch("/api/vote", {
      body: JSON.stringify({
        video,
        up: upvote,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    setIsLiked(upvote);

    router.reload();
  }

  return (
    <div className="flex items-center">
      <button
        className="flex items-center"
        type="button"
        onClick={() => voteHandler(true)}
      >
        <FiThumbsUp fill={isLiked ? "#FFF" : "#000"} />
        <span className="p-1">{upvotes}</span>
      </button>
      <button
        name="dislike"
        className="flex items-center"
        type="button"
        onClick={() => voteHandler(false)}
      >
        <FiThumbsDown fill={!isLiked ? "#FFF" : "#000"} />
        <span className="p-1">{downvotes}</span>
      </button>
    </div>
  );
}
