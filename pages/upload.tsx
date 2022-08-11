/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable consistent-return */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Heading from "../components/Heading";

const getVideoDuration = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const media = new Audio(reader.result as string);
      media.onloadedmetadata = () => resolve(media.duration);
    };
    reader.readAsDataURL(file);
    reader.onerror = (error) => reject(error);
  });

export default function Upload() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [duration, setDuration] = useState(null);

  if (!session || !session.user) {
    return null;
  }

  if (loading) {
    return null;
  }

  return (
    <>
      <Heading />
      <form
        className="mt-10 ml-20 text-center"
        onSubmit={async (e) => {
          e.preventDefault();

          const body = new FormData();
          body.append("image", image);
          body.append("title", title);
          body.append("video", video);
          body.append("duration", duration);

          await fetch("/api/upload", {
            body,
            method: "POST",
          });

          router.push(`/channel/${session.user.username}`);
        }}
      >
        <div className="mb-5 flex-1">
          <div className="mb-5 flex-1">
            Title
            <input
              type="text"
              name="name"
              onChange={(e) => setTitle(e.target.value)}
              className="border p-1 text-black"
              required
            />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <label className="relative my-3 block cursor-pointer font-medium">
            <p>Video thumbnail {image && "✅"}</p> (800 * 450 suggested)
            <input
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              required
              onChange={(event) => {
                if (event.target.files && event.target.files[0]) {
                  if (event.target.files[0].size > 3072000) {
                    alert("maximum size allowed is 3mb");
                    return false;
                  }
                  setImage(event.target.files[0]);
                }
              }}
            />
          </label>
        </div>
        <div className="text-sm text-gray-600">
          <label className="relative my-3 block cursor-pointer font-medium">
            <p>Video file {video && "✅"}</p>
            <input
              name="name"
              type="file"
              accept="video/*"
              className="hidden"
              required
              onChange={async (event) => {
                if (event.target.files && event.target.files[0]) {
                  if (event.target.files[0].size > 20971520) {
                    alert("maximim size allowed is 20mb");
                    return false;
                  }

                  const fileDuration = await getVideoDuration(
                    event.target.files[0]
                  );

                  if (typeof fileDuration === "string") {
                    setDuration(parseInt(fileDuration, 10));
                    setVideo(event.target.files[0]);
                  }
                }
              }}
            />
          </label>
        </div>
        <button
          disabled={!(title && video && image)}
          className={`mt-0 rounded-full border px-8 py-2 font-bold ${
            title && video && image
              ? ""
              : "cursor-not-allowed-text-gray-800 border-gray-800"
          }`}
          type="submit"
        >
          Upload
        </button>
      </form>
    </>
  );
}
