import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";

export default function Vote({ video, downvotes, upvotes }) {
  // api to create

  return (
    <div className="flex">
      <FiThumbsUp />
      <span>{upvotes}</span>
      <FiThumbsDown />
      <span>{downvotes}</span>
    </div>
  );
}
