import { useEffect, useState } from "react";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";

export default function Vote({ videoId }) {
  const [isLiked, setIsLiked] = useState(null);
  const [upvotes, setUpvotes] = useState();
  const [downvotes, setDownvotes] = useState();

  useEffect(() => {
    const fetchVotes = async () => {
      const raw = await fetch(`/api/vote?video=${videoId}`);
      const data = await raw.json();
      setIsLiked(data.vote.up);
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
    };
    fetchVotes().catch((error) => console.log(error));
  }, [isLiked, videoId]);

  async function voteHandler(upvote) {
    setIsLiked(upvote);
    await fetch("/api/vote", {
      body: JSON.stringify({
        video: videoId,
        up: upvote,
      }),

      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
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
        <FiThumbsDown fill={isLiked === false ? "#000" : "#FFF"} />
        <span className="p-1">{downvotes}</span>
      </button>
    </div>
  );
}
