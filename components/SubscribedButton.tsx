/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { useRouter } from "next/router";
import { useState } from "react";

export default function SubscribedButton({ user, subscribed }) {
  const router = useRouter();

  const [subscribedButtonText, setSubscribedButtonText] =
    useState("Subscribed");
  const [subscribedButtonColor, setSubscribedButtonColor] = useState("green");

  return (
    <>
      {subscribed ? (
        <button
          type="button"
          className={`bg-${subscribedButtonColor}-500 rounded-md px-3 py-2`}
          onClick={async () => {
            await fetch("/api/unsubscribe", {
              body: JSON.stringify({
                unsubscribeTo: user.id,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            });

            router.reload();
          }}
          onMouseOver={() => {
            setSubscribedButtonText("Unsubscribe");
            setSubscribedButtonColor("red");
          }}
          onMouseOut={() => {
            setSubscribedButtonText("Subscribed");
            setSubscribedButtonColor("green");
          }}
        >
          {subscribedButtonText}
        </button>
      ) : (
        <button
          type="button"
          className=" rounded-md bg-red-500 px-3  py-2"
          onClick={async () => {
            await fetch("/api/subscribe", {
              body: JSON.stringify({
                subscribeTo: user.id,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            });

            router.reload();
          }}
        >
          Subscribe
        </button>
      )}
    </>
  );
}
