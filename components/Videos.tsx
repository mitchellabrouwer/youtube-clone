import Video from "./Video";

export default function Videos({ videos }) {
  if (!videos) {
    return null;
  }
  return (
    <div className="flex flex-wrap">
      {videos.map((video, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className="w-full md:w-1/2 lg:w-1/3" key={index}>
          <Video video={video} />
        </div>
      ))}
    </div>
  );
}
