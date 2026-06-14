export function HeroVisual() {
  return (
    <div className="relative w-full flex items-end justify-center select-none">
      {/* Soft purple glow behind the box */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-40 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" />
      <img
        src="/uploads/ChatGPT_Image_Jun_14__2026__10_44_07_AM-removebg-preview.png"
        alt="Premium AI Tools"
        className="relative w-full max-w-[540px] h-auto object-contain"
        style={{ filter: 'drop-shadow(0 24px 48px rgba(124,58,237,0.18))' }}
        draggable={false}
      />
    </div>
  );
}
