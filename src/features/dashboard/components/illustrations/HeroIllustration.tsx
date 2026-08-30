// Modern 2.5D & Glassmorphic Medical Network Illustration for Hero Banner
// Designed to blend seamlessly on the clinical teal background with glowing nodes, depth layers, and medical icons.

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Soft glass gradient */}
        <linearGradient id="heroGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
        </linearGradient>

        {/* Solid white highlights */}
        <linearGradient id="solidGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.75" />
        </linearGradient>

        {/* Glow gradients */}
        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="flowLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Background Ambient Glow */}
      <circle cx="230" cy="130" r="120" fill="url(#hubGlow)" />
      <circle cx="340" cy="90" r="80" fill="url(#hubGlow)" />

      {/* Network Orbital Rings */}
      <ellipse
        cx="230"
        cy="150"
        rx="180"
        ry="75"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      <ellipse
        cx="230"
        cy="150"
        rx="120"
        ry="50"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />

      {/* Connecting Flow Waves */}
      <path
        d="M 60 170 Q 140 100 230 145 T 390 110"
        stroke="url(#flowLine)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Floating Data Packet Nodes on Flow Line */}
      <circle cx="145" cy="125" r="4" fill="white" fillOpacity="0.9" />
      <circle cx="145" cy="125" r="8" fill="white" fillOpacity="0.25" />
      <circle cx="310" cy="132" r="3.5" fill="white" fillOpacity="0.9" />
      <circle cx="310" cy="132" r="7" fill="white" fillOpacity="0.25" />

      {/* ======================================================== */}
      {/* 1. Main Hospital Medical Center (Left-Center)            */}
      {/* ======================================================== */}
      <g transform="translate(60, 45)">
        {/* Shadow base */}
        <ellipse cx="65" cy="165" rx="60" ry="16" fill="black" fillOpacity="0.1" />

        {/* Back building tower */}
        <rect
          x="15"
          y="20"
          width="100"
          height="140"
          rx="14"
          fill="url(#heroGlass)"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />

        {/* Roof Heliport / Tech Cap */}
        <rect
          x="30"
          y="8"
          width="70"
          height="14"
          rx="6"
          fill="white"
          fillOpacity="0.35"
          stroke="white"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        {/* Heliport Cross */}
        <rect x="62" y="11" width="6" height="8" rx="1.5" fill="white" />
        <rect x="58" y="13" width="14" height="4" rx="1.5" fill="white" />

        {/* Front building block with Glass Facade */}
        <rect
          x="0"
          y="50"
          width="130"
          height="110"
          rx="12"
          fill="url(#heroGlass)"
          stroke="white"
          strokeOpacity="0.6"
          strokeWidth="2"
        />

        {/* Window Matrix */}
        <g opacity="0.85">
          <rect x="16" y="65" width="20" height="14" rx="3" fill="white" fillOpacity="0.45" />
          <rect x="44" y="65" width="20" height="14" rx="3" fill="white" fillOpacity="0.45" />
          <rect x="72" y="65" width="20" height="14" rx="3" fill="white" fillOpacity="0.45" />
          <rect x="98" y="65" width="16" height="14" rx="3" fill="white" fillOpacity="0.45" />

          <rect x="16" y="88" width="20" height="14" rx="3" fill="white" fillOpacity="0.45" />
          <rect x="44" y="88" width="20" height="14" rx="3" fill="white" fillOpacity="0.45" />
          <rect x="72" y="88" width="20" height="14" rx="3" fill="white" fillOpacity="0.45" />
          <rect x="98" y="88" width="16" height="14" rx="3" fill="white" fillOpacity="0.45" />
        </g>

        {/* Main Entrance / Emergency Portal */}
        <rect
          x="46"
          y="118"
          width="38"
          height="42"
          rx="8"
          fill="white"
          fillOpacity="0.4"
          stroke="white"
          strokeOpacity="0.8"
          strokeWidth="1.5"
        />
        {/* Luminous Cross on Door */}
        <rect x="62" y="128" width="6" height="18" rx="2" fill="white" />
        <rect x="56" y="134" width="18" height="6" rx="2" fill="white" />

        {/* Glowing Medical Cross Badge Floating Over Building */}
        <g transform="translate(100, 20)">
          <circle cx="18" cy="18" r="18" fill="url(#solidGlass)" stroke="white" strokeWidth="2" />
          <rect x="15" y="8" width="6" height="20" rx="2" fill="#0d9488" />
          <rect x="8" y="15" width="20" height="6" rx="2" fill="#0d9488" />
        </g>
      </g>

      {/* ======================================================== */}
      {/* 2. Medicine Supply & Smart Capsule (Center-Right)        */}
      {/* ======================================================== */}
      <g transform="translate(240, 135) rotate(-18)">
        {/* Capsule Shadow */}
        <rect x="4" y="12" width="76" height="28" rx="14" fill="black" fillOpacity="0.12" />

        {/* Capsule Body */}
        <rect
          x="0"
          y="0"
          width="80"
          height="30"
          rx="15"
          fill="url(#heroGlass)"
          stroke="white"
          strokeOpacity="0.75"
          strokeWidth="2"
        />
        {/* Solid Half */}
        <rect x="0" y="0" width="40" height="30" rx="15" fill="white" fillOpacity="0.85" />
        {/* Center Ring Divider */}
        <line x1="40" y1="0" x2="40" y2="30" stroke="white" strokeWidth="2" strokeOpacity="0.9" />
        {/* Reflection Highlight */}
        <line x1="10" y1="7" x2="32" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line
          x1="48"
          y1="7"
          x2="68"
          y2="7"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </g>

      {/* ======================================================== */}
      {/* 3. Floating Smart Vital Wave / Hologram (Right-Center)   */}
      {/* ======================================================== */}
      <g transform="translate(280, 50)">
        {/* Floating Glass Plaque */}
        <rect
          x="0"
          y="0"
          width="135"
          height="75"
          rx="16"
          fill="url(#heroGlass)"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          backdrop-filter="blur(8px)"
        />

        {/* Header inside plaque */}
        <circle cx="20" cy="22" r="7" fill="white" fillOpacity="0.3" />
        <path
          d="M17 22 L20 25 L24 19"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="34" y="18" width="55" height="8" rx="3" fill="white" fillOpacity="0.7" />

        {/* ECG Vital Line */}
        <path
          d="M 12 50 L 35 50 L 42 36 L 50 62 L 60 40 L 68 54 L 75 50 L 122 50"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glowing Peak Dot */}
        <circle cx="50" cy="62" r="3.5" fill="white" />
        <circle cx="50" cy="62" r="7" fill="white" fillOpacity="0.3" />
      </g>

      {/* ======================================================== */}
      {/* 4. Mini Floating Supply Badge (Bottom-Right)             */}
      {/* ======================================================== */}
      <g transform="translate(330, 155)">
        <rect
          x="0"
          y="0"
          width="90"
          height="38"
          rx="12"
          fill="url(#heroGlass)"
          stroke="white"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <circle cx="20" cy="19" r="10" fill="white" fillOpacity="0.35" />
        {/* Truck/Box Icon inside badge */}
        <rect x="15" y="15" width="10" height="8" rx="1.5" fill="white" />
        <rect x="36" y="14" width="40" height="6" rx="2" fill="white" fillOpacity="0.8" />
        <rect x="36" y="23" width="26" height="5" rx="2" fill="white" fillOpacity="0.5" />
      </g>

      {/* ======================================================== */}
      {/* 5. Floating Sparkles & Depth Particles                   */}
      {/* ======================================================== */}
      {/* Top Left Star */}
      <path
        d="M 40 25 Q 40 35 30 35 Q 40 35 40 45 Q 40 35 50 35 Q 40 35 40 25 Z"
        fill="white"
        fillOpacity="0.6"
      />
      {/* Top Right Star */}
      <path
        d="M 425 28 Q 425 35 418 35 Q 425 35 425 42 Q 425 35 432 35 Q 425 35 425 28 Z"
        fill="white"
        fillOpacity="0.5"
      />
      {/* Small Ambient Dots */}
      <circle cx="25" cy="115" r="3" fill="white" fillOpacity="0.3" />
      <circle cx="200" cy="28" r="4" fill="white" fillOpacity="0.4" />
      <circle cx="270" cy="225" r="3.5" fill="white" fillOpacity="0.35" />
      <circle cx="440" cy="210" r="3" fill="white" fillOpacity="0.4" />
    </svg>
  )
}
