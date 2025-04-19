export function HighlightKeyword({
  text,
  keyword,
}: {
  text: string;
  keyword: string;
}) {
  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span className="bg-violet-300 dark:bg-violet-600" key={i}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
