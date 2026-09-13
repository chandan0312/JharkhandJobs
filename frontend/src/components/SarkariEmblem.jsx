export default function SarkariEmblem({ size = 44, className = '' }) {
  return (
    <div
      className={`group/emblem relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      style={{ width: size, height: size }}
      title="Job Alert X"
    >
      {/* Outer ambient golden/emerald glow */}
      <span
        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/30 via-emerald-500/20 to-amber-400/30 blur-md transition-all duration-300 group-hover/emblem:scale-125 group-hover/emblem:blur-lg"
        aria-hidden="true"
      />

      {/* Emblem Badge Container */}
      <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#061c14] via-[#091524] to-[#040d1a] border border-amber-500/30 shadow-inner overflow-visible transition-transform duration-300 group-hover/emblem:scale-105">
        <svg
          viewBox="0 0 100 100"
          className="h-[90%] w-[90%] overflow-visible drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich Gold Gradient for Dome & Columns */}
            <linearGradient id="goldBuilding" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="25%" stopColor="#facc15" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            {/* Deep Gold Shading Gradient */}
            <linearGradient id="goldShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>

            {/* Emerald Green Wreath Gradient */}
            <linearGradient id="emeraldWreath" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>

          {/* === LEFT LAUREL WREATH LEAVES === */}
          <g className="wreath-left" fill="url(#emeraldWreath)" stroke="#064e3b" strokeWidth="0.5">
            <path d="M22 32 C17 38 15 48 18 56 C19 50 22 42 26 36 Z" />
            <path d="M16 42 C12 48 11 58 15 66 C15 60 18 52 22 46 Z" />
            <path d="M14 54 C10 62 11 72 17 78 C16 70 18 63 22 58 Z" />
            <path d="M16 66 C13 74 16 82 24 86 C21 80 21 73 24 68 Z" />
            {/* Stem curve */}
            <path
              d="M26 34 C19 46 16 64 22 84"
              stroke="url(#emeraldWreath)"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* === RIGHT LAUREL WREATH LEAVES === */}
          <g className="wreath-right" fill="url(#emeraldWreath)" stroke="#064e3b" strokeWidth="0.5">
            <path d="M78 32 C83 38 85 48 82 56 C81 50 78 42 74 36 Z" />
            <path d="M84 42 C88 48 89 58 85 66 C85 60 82 52 78 46 Z" />
            <path d="M86 54 C90 62 89 72 83 78 C84 70 82 63 78 58 Z" />
            <path d="M84 66 C87 74 84 82 76 86 C79 80 79 73 76 68 Z" />
            {/* Stem curve */}
            <path
              d="M74 34 C81 46 84 64 78 84"
              stroke="url(#emeraldWreath)"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* === GOVERNMENT MONUMENT BUILDING === */}
          <g className="monument-body">
            {/* 1. Flagpole and Fluttering Flag on Top */}
            <line x1="50" y1="9" x2="50" y2="22" stroke="url(#goldBuilding)" strokeWidth="1.5" strokeLinecap="round" />
            <path
              d="M50 9 Q56 7 62 10 Q56 13 50 15 Z"
              fill="url(#goldBuilding)"
              className="flag-flutter"
            />
            {/* Finial / Spire Ball */}
            <circle cx="50" cy="22" r="2" fill="url(#goldBuilding)" />

            {/* 2. Main Large Dome */}
            <path
              d="M32 44 C32 28 40 23 50 23 C60 23 68 28 68 44 Z"
              fill="url(#goldBuilding)"
              stroke="#78350f"
              strokeWidth="0.8"
            />
            {/* Dome Highlight Ridge */}
            <path
              d="M37 43 C38 32 44 26 50 25 C56 26 62 32 63 43 Z"
              fill="none"
              stroke="#fef9c3"
              strokeWidth="0.8"
              opacity="0.8"
            />

            {/* 3. Upper Cornice / Architrave Under Dome */}
            <rect
              x="26"
              y="44"
              width="48"
              height="4"
              rx="1.5"
              fill="url(#goldBuilding)"
              stroke="#78350f"
              strokeWidth="0.7"
            />
            <rect
              x="24"
              y="48"
              width="52"
              height="3.5"
              rx="1"
              fill="url(#goldShadow)"
              stroke="#78350f"
              strokeWidth="0.6"
            />

            {/* 4. Classical Colonnade Pillars / Columns */}
            {/* Pillar 1 */}
            <rect x="27" y="52" width="4.5" height="20" rx="1" fill="url(#goldBuilding)" stroke="#78350f" strokeWidth="0.5" />
            {/* Pillar 2 */}
            <rect x="35" y="52" width="4.5" height="20" rx="1" fill="url(#goldBuilding)" stroke="#78350f" strokeWidth="0.5" />
            {/* Pillar 3 (Center-Left) */}
            <rect x="43" y="52" width="4.5" height="20" rx="1" fill="url(#goldBuilding)" stroke="#78350f" strokeWidth="0.5" />
            {/* Pillar 4 (Center-Right) */}
            <rect x="52.5" y="52" width="4.5" height="20" rx="1" fill="url(#goldBuilding)" stroke="#78350f" strokeWidth="0.5" />
            {/* Pillar 5 */}
            <rect x="60.5" y="52" width="4.5" height="20" rx="1" fill="url(#goldBuilding)" stroke="#78350f" strokeWidth="0.5" />
            {/* Pillar 6 */}
            <rect x="68.5" y="52" width="4.5" height="20" rx="1" fill="url(#goldBuilding)" stroke="#78350f" strokeWidth="0.5" />

            {/* Behind Pillars Shadow Wall */}
            <rect x="26" y="52" width="48" height="20" fill="#451a03" opacity="0.35" />

            {/* 5. Base Pedestal Steps */}
            <rect
              x="22"
              y="72"
              width="56"
              height="3.5"
              rx="1"
              fill="url(#goldBuilding)"
              stroke="#78350f"
              strokeWidth="0.6"
            />
            <rect
              x="19"
              y="75.5"
              width="62"
              height="4"
              rx="1"
              fill="url(#goldShadow)"
              stroke="#78350f"
              strokeWidth="0.6"
            />

            {/* 6. Bottom Golden Scroll / Foundation Leaf */}
            <path
              d="M18 82 Q50 78 82 82 Q50 86 18 82 Z"
              fill="url(#goldBuilding)"
              stroke="#78350f"
              strokeWidth="0.6"
            />
            {/* Wheat/leaf accents at bottom base */}
            <path
              d="M20 81 C26 83 32 87 36 91 C30 89 24 87 18 85 Z"
              fill="url(#goldBuilding)"
            />
            <path
              d="M80 81 C74 83 68 87 64 91 C70 89 76 87 82 85 Z"
              fill="url(#goldBuilding)"
            />
          </g>
        </svg>
      </div>

      {/* Scoped CSS animation */}
      <style>{`
        @keyframes flagWave {
          0%, 100% {
            d: path("M50 9 Q56 7 62 10 Q56 13 50 15 Z");
            transform: translateY(0);
          }
          50% {
            d: path("M50 9 Q56 11 62 8 Q56 15 50 15 Z");
            transform: translateY(-0.5px);
          }
        }

        @keyframes emblemShine {
          0%, 100% {
            filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.8)) drop-shadow(0 0 4px rgba(16, 185, 129, 0.5));
          }
        }

        .flag-flutter {
          animation: flagWave 2.5s ease-in-out infinite;
        }

        .group\\/emblem:hover .monument-body {
          filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.9));
          transition: filter 0.3s ease;
        }
      `}</style>
    </div>
  )
}
