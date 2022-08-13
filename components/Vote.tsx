import { useEffect, useState } from "react";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";

export default function Vote({ videoId }) {
  // api to create

  const [isLiked, setIsLiked] = useState(null);

  const [upvotes, setUpvotes] = useState();
  const [downvotes, setDownvotes] = useState();

  useEffect(() => {
    const fetchVotes = async () => {
      const json = await fetch(`/api/vote?video=${videoId}`);
      const data = await json.json();
      setIsLiked(data.vote);
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
    };
    fetchVotes().catch((error) => console.log(error));
  }, [isLiked, videoId]);

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
    setIsLiked(upvote);
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
