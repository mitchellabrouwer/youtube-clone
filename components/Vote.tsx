import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";

export default function Vote({ videoId }) {
  const { data: session } = useSession();

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
    fetchVotes();
  }, [videoId]);

  async function voteHandler(upvote) {
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

    const raw = await fetch(`/api/vote?video=${videoId}`);
    const data = await raw.json();
    setIsLiked(data.vote.up);
    setUpvotes(data.upvotes);
    setDownvotes(data.downvotes);
  }

  return (
    <div className="flex items-center">
      <button
        className="flex items-center"
        type="button"
        onClick={() => voteHandler(true)}
        disabled={!session?.user}
      >
        <FiThumbsUp fill={isLiked === true ? "#FFF" : "#000"} />
        <span className="p-1">{upvotes}</span>
      </button>
      <button
        name="dislike"
        className="flex items-center"
        type="button"
        onClick={() => voteHandler(false)}
        disabled={!session?.user}
      >
        <FiThumbsDown fill={isLiked === false ? "#FFF" : "#000"} />
        <span className="p-1">{downvotes}</span>
      </button>
    </div>
  );
}
