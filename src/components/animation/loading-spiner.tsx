export default function LoadingSpiner() {
  const arr = [...Array(12)];
  return (
    <div className="items-center top-1/2 -translate-y-1/2 justify-center left-1/2 -translate-x-1/2 absolute">
      {arr.map((_, idx) => (
        <span
          className={`bg-zinc-500 absolute w-[3px] origin-bottom  h-[9px] rounded-md animate-opacity`}
          style={{
            animationDelay: `${idx * 0.1}s`,
            transform: `rotate(${(idx - 0) * 30}deg) translateY(-80%)`,
          }}
          key={idx}
        />
      ))}
    </div>
  );
}
