export default function FoxLogo({ size = 44, className = '' }) {
  return (
    <div
      className={`group/fox relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      style={{ width: size, height: size }}
      title="Job Alert X"
    >
      {/* Outer subtle glow */}
      <span
        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-500/30 via-transparent to-cyan-500/30 blur-md transition-all duration-300 group-hover/fox:scale-125 group-hover/fox:blur-lg"
        aria-hidden="true"
      />

      {/* Hexagonal / Rounded Badge Container */}
      <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-[#090d1a] ring-1 ring-cyan-500/30 shadow-inner overflow-visible transition-transform duration-300 group-hover/fox:scale-105">
        <svg
          viewBox="0 0 100 100"
          className="h-[88%] w-[88%] overflow-visible drop-shadow-[0_2px_10px_rgba(0,229,255,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Back Hexagon Grid Accent */}
          <polygon
            points="50,4 90,26 90,74 50,96 10,74 10,26"
            stroke="rgba(0, 229, 255, 0.2)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Low-Poly Dual-Toned Fox (Orange Warm Left / Cyan Blue Right) */}
          <g className="fox-faceted-head origin-center">
            {/* === LEFT EAR & WARM FACETS === */}
            {/* Left Ear Tip Outer */}
            <polygon points="50,42 22,8 36,36" fill="#f97316" />
            {/* Left Ear Inner */}
            <polygon points="36,36 22,8 14,40" fill="#ea580c" />
            {/* Left Ear Base */}
            <polygon points="14,40 36,36 26,56" fill="#c2410c" />

            {/* Forehead Center Left */}
            <polygon points="50,24 36,36 50,42" fill="#fb923c" />
            {/* Forehead Top Point */}
            <polygon points="50,24 50,42 50,56" fill="#f97316" />

            {/* Left Cheek Upper */}
            <polygon points="36,36 50,42 50,56 26,56" fill="#ea580c" />
            {/* Left Cheek Outer Wing */}
            <polygon points="26,56 10,50 14,40" fill="#f97316" />
            <polygon points="26,56 12,68 10,50" fill="#ea580c" />

            {/* Left Snout Upper */}
            <polygon points="26,56 50,56 42,74 12,68" fill="#fb923c" />
            {/* Left Snout Lower */}
            <polygon points="42,74 50,56 50,78" fill="#f97316" />
            {/* Left Chin */}
            <polygon points="42,74 50,78 50,92 34,88" fill="#ea580c" />


            {/* === RIGHT EAR & COOL BLUE/CYAN FACETS === */}
            {/* Right Ear Tip Outer */}
            <polygon points="50,42 78,8 64,36" fill="#0284c7" />
            {/* Right Ear Inner */}
            <polygon points="64,36 78,8 86,40" fill="#0369a1" />
            {/* Right Ear Base */}
            <polygon points="86,40 64,36 74,56" fill="#075985" />

            {/* Forehead Center Right */}
            <polygon points="50,24 64,36 50,42" fill="#38bdf8" />

            {/* Right Cheek Upper */}
            <polygon points="64,36 50,42 50,56 74,56" fill="#0284c7" />
            {/* Right Cheek Outer Wing */}
            <polygon points="74,56 90,50 86,40" fill="#0ea5e9" />
            <polygon points="74,56 88,68 90,50" fill="#0369a1" />

            {/* Right Snout Upper */}
            <polygon points="74,56 50,56 58,74 88,68" fill="#38bdf8" />
            {/* Right Snout Lower */}
            <polygon points="58,74 50,56 50,78" fill="#0284c7" />
            {/* Right Chin */}
            <polygon points="58,74 50,78 50,92 66,88" fill="#0369a1" />

            {/* Center Nose Tip */}
            <polygon points="46,88 54,88 50,94" fill="#0f172a" />

            {/* Facet Highlights (Subtle Wireframe Shimmer) */}
            <polyline
              points="22,8 50,42 78,8"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <line
              x1="50" y1="24" x2="50" y2="92"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.8"
            />
          </g>
        </svg>
      </div>

      {/* Scoped CSS animation */}
      <style>{`
        @keyframes foxFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-1.5px) scale(1.02); }
        }
        .fox-faceted-head {
          animation: foxFloat 4s ease-in-out infinite;
        }
        .group\\/fox:hover .fox-faceted-head {
          filter: drop-shadow(0 0 6px rgba(249, 115, 22, 0.8));
          transition: filter 0.3s ease;
        }
      `}</style>
    </div>
  )
}
