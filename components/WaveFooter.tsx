export default function WaveFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden">
      <svg
        className="block w-full text-hero"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,64 C240,120 480,0 720,40 C960,80 1200,120 1440,48 L1440,120 L0,120 Z"
        />
      </svg>
      <div className="wave-footer relative -mt-px px-6 pb-6 pt-2 text-center">
        <div className="mb-3 flex items-end justify-center gap-8" aria-hidden="true">
          <Leaf className="-mb-1 rotate-[-20deg] text-emerald-400" />
          <Leaf className="mb-2 rotate-[15deg] scale-110 text-lime-500" />
          <Leaf className="-mb-1 rotate-[8deg] text-emerald-500" />
        </div>
        <p className="font-display text-sm font-semibold text-foreground">
          Maugat East Elementary School
        </p>
        <p className="text-xs text-muted">
          Maugat East, Padre Garcia, Batangas
        </p>
      </div>
    </footer>
  );
}

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-10 w-10 ${className}`}
      viewBox="0 0 40 40"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 4C12 10 6 18 8 28c6 2 14 2 20-2 2-10-2-18-8-22z" opacity="0.9" />
      <path
        d="M20 8c0 10 0 16-2 22"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
