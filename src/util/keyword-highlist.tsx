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
          <span className="bg-primary/30 dark:bg-primary/50" key={i}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
