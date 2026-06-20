export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-primary text-text-primary">
      <div className="flex flex-col items-center gap-4">
        {/* Simple spinner using CSS and tailwind animation */}
        <div className="h-12 w-12 rounded-full border-4 border-accent-glow/20 border-t-accent-glow animate-spin" />
        <span className="font-heading text-sm font-semibold tracking-wider text-text-secondary animate-pulse">
          Yuklanmoqda...
        </span>
      </div>
    </div>
  );
}
