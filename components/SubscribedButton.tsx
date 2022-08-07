import { useRouter } from "next/router";

export default function SubscribedButton({ user }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="rounded-md bg-red-500 px-3 py-2"
      onClick={async () => {
        await fetch("/api/subscribe", {
          body: JSON.stringify({ subscribeTo: user.id }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        router.reload();
      }}
    >
      Subscribe
    </button>
  );
}
