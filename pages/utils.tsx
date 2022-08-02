export default function Utils() {
  return (
    <div className="mt-10 ml-20">
      <h2 className="mb-10 text-xl">Utils</h2>

      <div className="mb-5 flex-1">
        <button
          type="button"
          className="color-accent-contrast bg-color-accent hover:bg-color-accent-hover-darker mt-5 mr-8 rounded-full border px-8 py-2 font-bold"
          onClick={async () => {
            await fetch("/api/utils", {
              body: JSON.stringify({
                task: "generate_content",
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            });
          }}
        >
          Generate content
        </button>
      </div>
      <div className="mb-5 flex-1">
        <button
          type="button"
          className="color-accent-contrast bg-color-accent hover:bg-color-accent-hover-darker mt-5 mr-8 rounded-full border px-8 py-2 font-bold"
          onClick={async () => {
            await fetch("/api/utils", {
              body: JSON.stringify({
                task: "clean_database",
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            });
          }}
        >
          Clean database
        </button>
      </div>
    </div>
  );
}
