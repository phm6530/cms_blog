export default function LoadingSpinerV2({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center h-8">
      <div className="size-5 border-2 border-t-transparent border-zinc-400 rounded-full animate-spin " />
      <span className="ml-4 opacity-70">{text}</span>
    </div>
  );
}
