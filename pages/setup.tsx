/* eslint-disable consistent-return */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Setup() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  if (!session || !session.user) return null;
  if (loading) return null;
  console.log("session.user.name", !session.user.name);
  console.log("session.user.image", !session.user.image);

  if (!loading && session.user.name) {
    router.push("/");
  }

  return (
    <form
      className="mt-10 ml-20"
      onSubmit={async (e) => {
        e.preventDefault();

        const body = new FormData();
        body.append("image", image);
        body.append("name", name);
        body.append("username", username);

        await fetch("/api/setup", {
          body,
          method: "POST",
        });

        session.user.name = name;
        session.user.username = username;

        router.push("/");
      }}
    >
      <div className="mb-5 flex-1">
        <div className="mb-5 flex-1">Name</div>
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          className="border p-1 text-black"
          required
        />
      </div>
      <div className="mb-5 flex-1">
        <div className="mb-5 flex-1">Username</div>
        <input
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          className="border p-1 text-black"
          required
        />
      </div>
      <div className="text-sm text-gray-600 ">
        <label className="relative my-3 block cursor-pointer font-medium underline">
          {!imageURL && <p className="">Avatar</p>}
          <img src={imageURL} className="h-20 w-20" />
          <input
            name="image"
            type="file"
            accept="image/*"
            className="hidden"
            required
            onChange={(event) => {
              if (event.target.files && event.target.files[0]) {
                if (event.target.files[0].size > 3072000) {
                  alert("Maximum size allowed is 3MB");
                  return false;
                }
                setImage(event.target.files[0]);
                setImageURL(URL.createObjectURL(event.target.files[0]));
              }
            }}
          />
        </label>
      </div>

      <button
        className="mt-0 mr-8 rounded-full border px-8 py-2 font-bold"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}
