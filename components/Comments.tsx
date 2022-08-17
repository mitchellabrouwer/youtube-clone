/* eslint-disable react/no-array-index-key */

import Comment from "./Comment";
import NewComment from "./NewComment";

export default function Comments({ video, comments }) {
  return (
    <>
      {comments.map((comment, index) => (
        <div key={index}>
          <Comment key={index} comment={comment} />
        </div>
      ))}
      <NewComment id={video} />
    </>
  );
}
