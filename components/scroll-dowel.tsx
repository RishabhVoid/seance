// A rolled wooden dowel at the top/bottom of the scroll — gives the parchment
// a "scroll" feel without us having to render curling edges.

export function ScrollDowel({ position }: { position: "top" | "bottom" }) {
  const isTop = position === "top";
  return (
    <div
      className={
        "relative h-9 w-full " +
        (isTop
          ? "bg-gradient-to-b from-[#1a0f08] via-[#432a16] to-[#2a1a0e]"
          : "bg-gradient-to-t from-[#1a0f08] via-[#432a16] to-[#2a1a0e]")
      }
      style={{
        boxShadow: isTop
          ? "0 8px 18px -6px rgba(0,0,0,0.75), inset 0 -1px 0 rgba(255, 200, 120, 0.08)"
          : "0 -8px 18px -6px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255, 200, 120, 0.08)",
      }}
      aria-hidden
    >
      {/* wood grain stripes */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(90,50,20,0.0) 0, rgba(90,50,20,0.0) 36px, rgba(30,15,5,0.6) 36px, rgba(30,15,5,0.6) 37px)",
        }}
      />
      {/* subtle brass caps */}
      <div
        className="absolute inset-y-0 left-0 w-8"
        style={{
          background:
            "linear-gradient(90deg, #6b4a28, #8a6a3a 40%, #6b4a28 70%, transparent)",
          boxShadow: "inset -1px 0 2px rgba(0,0,0,0.5)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-8"
        style={{
          background:
            "linear-gradient(-90deg, #6b4a28, #8a6a3a 40%, #6b4a28 70%, transparent)",
          boxShadow: "inset 1px 0 2px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}
