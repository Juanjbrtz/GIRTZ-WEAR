"use client";

import { useEffect, useMemo, useState } from "react";

const INTRO_KEY = "girtz-intro-seen-v4";
const FRAME_MS = 95;
const HOLD_MS = 420;

const frames = [
  {
    footX: 170,
    footY: -220,
    footRotate: 18,
    footScale: 1.08,
    footOpacity: 0,
    footBlur: 6,
    printOpacity: 0,
    printScale: 0.82,
    printTextOpacity: 0,
    ringOpacity: 0,
    ringScale: 0.4,
  },
  {
    footX: 140,
    footY: -150,
    footRotate: 14,
    footScale: 1.06,
    footOpacity: 1,
    footBlur: 4,
    printOpacity: 0,
    printScale: 0.84,
    printTextOpacity: 0,
    ringOpacity: 0,
    ringScale: 0.5,
  },
  {
    footX: 92,
    footY: -80,
    footRotate: 10,
    footScale: 1.03,
    footOpacity: 1,
    footBlur: 2,
    printOpacity: 0.04,
    printScale: 0.88,
    printTextOpacity: 0,
    ringOpacity: 0.18,
    ringScale: 0.7,
  },
  {
    footX: 36,
    footY: -18,
    footRotate: 5,
    footScale: 1.01,
    footOpacity: 1,
    footBlur: 1,
    printOpacity: 0.12,
    printScale: 0.92,
    printTextOpacity: 0,
    ringOpacity: 0.32,
    ringScale: 1.1,
  },
  {
    footX: 0,
    footY: 0,
    footRotate: 0,
    footScale: 1,
    footOpacity: 1,
    footBlur: 0,
    printOpacity: 0.76,
    printScale: 1,
    printTextOpacity: 0.18,
    ringOpacity: 0.7,
    ringScale: 1.9,
  },
  {
    footX: -12,
    footY: 10,
    footRotate: -2,
    footScale: 0.985,
    footOpacity: 1,
    footBlur: 0,
    printOpacity: 0.9,
    printScale: 1.02,
    printTextOpacity: 0.62,
    ringOpacity: 0.42,
    ringScale: 2.8,
  },
  {
    footX: -34,
    footY: -24,
    footRotate: -7,
    footScale: 1.02,
    footOpacity: 0.92,
    footBlur: 0.5,
    printOpacity: 0.88,
    printScale: 1.01,
    printTextOpacity: 0.92,
    ringOpacity: 0.14,
    ringScale: 3.9,
  },
  {
    footX: -110,
    footY: -120,
    footRotate: -12,
    footScale: 1.05,
    footOpacity: 0.18,
    footBlur: 3,
    printOpacity: 0.84,
    printScale: 1,
    printTextOpacity: 0.96,
    ringOpacity: 0,
    ringScale: 4.8,
  },
] as const;

function markSeen() {
  try {
    window.sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    // The animation must never block the storefront when storage is unavailable.
  }
}

function wasSeen() {
  try {
    return window.sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

function SneakerStep() {
  return (
    <svg
      viewBox="0 0 320 520"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="shoeUpper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4f4f1" />
          <stop offset="42%" stopColor="#dadad5" />
          <stop offset="100%" stopColor="#84847f" />
        </linearGradient>

        <linearGradient id="shoeSole" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cfcfca" />
        </linearGradient>

        <linearGradient id="legTone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#343434" />
          <stop offset="100%" stopColor="#141414" />
        </linearGradient>

        <filter id="shoeTexture" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.86"
            numOctaves="2"
            seed="8"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 .08 0"
          />
        </filter>
      </defs>

      <path
        d="M182 8c18 0 34 10 41 24 8 16 8 37 5 55-6 32-18 74-26 106-9 35-19 65-34 84-11 14-27 21-45 18-15-3-28-12-36-24-11-17-10-43-4-66 10-40 24-76 34-116 6-21 11-42 23-57 10-13 25-24 42-24Z"
        fill="url(#legTone)"
        opacity="0.97"
      />

      <path
        d="M121 192c29-16 77-13 99 8 7 7 10 14 10 22-1 16-15 28-30 35-28 13-71 13-98-3-15-9-26-23-22-38 3-10 18-18 41-24Z"
        fill="#f0f0eb"
        opacity="0.92"
      />

      <ellipse
        cx="152"
        cy="345"
        rx="108"
        ry="54"
        fill="rgba(0,0,0,.28)"
        transform="rotate(-10 152 345)"
      />

      <path
        d="M41 319c17-38 53-70 92-88 33-15 73-24 98-13 13 6 23 18 31 29 7 11 19 18 31 23 16 7 27 17 29 31 3 16-4 29-20 38-17 10-43 15-78 17H129c-26 0-49-3-67-9-20-7-28-17-30-28-1-1-1-2-1-4 0-8 3-16 10-25Z"
        fill="url(#shoeUpper)"
        stroke="rgba(255,255,255,.34)"
        strokeWidth="2"
      />

      <path
        d="M41 319c17-38 53-70 92-88 33-15 73-24 98-13 13 6 23 18 31 29 7 11 19 18 31 23 16 7 27 17 29 31 3 16-4 29-20 38-17 10-43 15-78 17H129c-26 0-49-3-67-9-20-7-28-17-30-28-1-1-1-2-1-4 0-8 3-16 10-25Z"
        fill="rgba(255,255,255,.45)"
        filter="url(#shoeTexture)"
        opacity="0.32"
      />

      <path
        d="M77 304c25-22 51-40 83-52 18-6 34-10 46-10"
        fill="none"
        stroke="rgba(255,255,255,.28)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M63 325c25-10 58-16 96-18 40-2 84 1 122 8"
        fill="none"
        stroke="rgba(0,0,0,.2)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <g stroke="#1f1f1f" strokeWidth="2.5" strokeLinecap="round">
        <line x1="136" y1="255" x2="194" y2="245" />
        <line x1="131" y1="267" x2="196" y2="257" />
        <line x1="126" y1="279" x2="193" y2="269" />
        <line x1="122" y1="291" x2="190" y2="281" />
      </g>

      <path
        d="M241 255c19 6 42 20 51 34 6 9 5 18-2 26-8 8-23 14-44 17"
        fill="none"
        stroke="rgba(255,255,255,.3)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M33 347c7 12 23 22 43 28 20 6 44 9 69 9h132c23 0 41-3 57-10 18-7 29-17 30-31 1-12-7-23-22-31-10 10-29 17-51 19-29 4-69 5-120 5-36 0-72 4-106 11-11 2-22 5-32 9 0-3 0-6 1-9 1 0 1 0 1 0Z"
        fill="url(#shoeSole)"
        stroke="rgba(255,255,255,.38)"
        strokeWidth="2"
      />

      <g stroke="rgba(25,25,25,.34)" strokeWidth="3" strokeLinecap="round">
        <path d="M72 354l20 20" />
        <path d="M110 350l18 27" />
        <path d="M151 347l14 30" />
        <path d="M196 347l10 29" />
        <path d="M239 346l4 28" />
        <path d="M278 339l-2 27" />
      </g>

      <path
        d="M97 317c24-14 51-25 81-31 20-4 39-6 56-6-11 11-24 21-40 30-20 11-42 18-67 22-17 2-31 1-43-2 3-5 7-9 13-13Z"
        fill="#121212"
        opacity="0.94"
      />
    </svg>
  );
}

function Footprint({ textOpacity }: { textOpacity: number }) {
  return (
    <svg
      viewBox="0 0 280 520"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="printFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,.96)" />
          <stop offset="100%" stopColor="rgba(208,208,202,.78)" />
        </linearGradient>
        <filter id="printTexture" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves="3"
            seed="12"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g filter="url(#printTexture)">
        <ellipse cx="88" cy="42" rx="17" ry="19" fill="url(#printFill)" opacity="0.78" />
        <ellipse cx="118" cy="25" rx="15" ry="17" fill="url(#printFill)" opacity="0.86" />
        <ellipse cx="150" cy="18" rx="13" ry="15" fill="url(#printFill)" opacity="0.9" />
        <ellipse cx="180" cy="25" rx="12" ry="14" fill="url(#printFill)" opacity="0.82" />
        <ellipse cx="207" cy="42" rx="11" ry="13" fill="url(#printFill)" opacity="0.7" />

        <ellipse cx="150" cy="84" rx="73" ry="55" fill="url(#printFill)" opacity="0.92" />

        <path
          d="M88 143c19-12 40-19 63-20 27-2 56 5 81 18 13 8 24 19 27 32 7 33 10 74 5 119-6 64-19 119-42 159-18 31-43 47-71 50-33 4-64-10-87-41-24-32-39-79-47-140-5-40-6-77-2-109 2-15 13-29 30-40 13-9 28-15 43-18Z"
          fill="url(#printFill)"
          opacity="0.84"
        />

        <g fill="rgba(20,20,20,.2)">
          <rect x="86" y="170" width="118" height="18" rx="9" transform="rotate(-7 145 179)" />
          <rect x="76" y="214" width="136" height="17" rx="8.5" transform="rotate(-3 144 222)" />
          <rect x="78" y="258" width="134" height="17" rx="8.5" transform="rotate(3 145 266)" />
          <rect x="84" y="302" width="120" height="17" rx="8.5" transform="rotate(-3 144 310)" />
          <rect x="95" y="346" width="101" height="17" rx="8.5" transform="rotate(3 145 354)" />
          <rect x="109" y="395" width="74" height="20" rx="10" />
        </g>

        <g fill="rgba(255,255,255,.33)">
          <circle cx="76" cy="202" r="4" />
          <circle cx="212" cy="198" r="3" />
          <circle cx="64" cy="278" r="3" />
          <circle cx="221" cy="288" r="4" />
          <circle cx="91" cy="368" r="3" />
          <circle cx="189" cy="418" r="3" />
        </g>
      </g>

      <g opacity={textOpacity}>
        <text
          x="147"
          y="278"
          textAnchor="middle"
          fontSize="34"
          fontWeight="800"
          letterSpacing="-2.3"
          fill="#080808"
          transform="rotate(90 147 278)"
        >
          GIRTZ
        </text>
        <text
          x="147"
          y="317"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          letterSpacing="5"
          fill="#080808"
          transform="rotate(90 147 317)"
        >
          WEAR
        </text>
      </g>
    </svg>
  );
}

export function IntroMark() {
  const [visible, setVisible] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  const totalDuration = useMemo(
    () => frames.length * FRAME_MS + HOLD_MS,
    [],
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || wasSeen()) {
      markSeen();
      return;
    }

    setVisible(true);
    setFrameIndex(0);
    markSeen();

    let current = 0;

    const interval = window.setInterval(() => {
      current += 1;
      if (current >= frames.length - 1) {
        setFrameIndex(frames.length - 1);
        window.clearInterval(interval);
        return;
      }
      setFrameIndex(current);
    }, FRAME_MS);

    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, totalDuration);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [totalDuration]);

  if (!visible) return null;

  const frame = frames[frameIndex];

  return (
    <div className="intro-screen" aria-hidden="true">
      <div className="intro-bg" />
      <div className="intro-grid" />

      <div className="intro-stage">
        <div
          className="impact-ring"
          style={{
            opacity: frame.ringOpacity,
            transform: `translate(-50%, -50%) scale(${frame.ringScale})`,
          }}
        />

        <div
          className="print-wrap"
          style={{
            opacity: frame.printOpacity,
            transform: `scale(${frame.printScale}) rotate(-10deg)`,
          }}
        >
          <Footprint textOpacity={frame.printTextOpacity} />
        </div>

        <div
          className="foot-wrap"
          style={{
            opacity: frame.footOpacity,
            filter: `blur(${frame.footBlur}px)`,
            transform: `translate3d(${frame.footX}px, ${frame.footY}px, 0) rotate(${frame.footRotate}deg) scale(${frame.footScale})`,
          }}
        >
          <SneakerStep />
        </div>
      </div>

      <p className="intro-caption">LEAVE YOUR MARK.</p>

      <style jsx>{`
        .intro-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          overflow: hidden;
          display: grid;
          place-items: center;
          background: #050505;
          animation: fadeout ${totalDuration}ms cubic-bezier(.2,.8,.2,1) both;
        }

        .intro-bg,
        .intro-grid {
          position: absolute;
          inset: 0;
        }

        .intro-bg {
          background:
            radial-gradient(circle at 50% 50%, rgba(255,255,255,.08), transparent 24%),
            radial-gradient(circle at 50% 68%, rgba(255,255,255,.03), transparent 34%),
            linear-gradient(180deg, rgba(255,255,255,.018), transparent 34%, rgba(0,0,0,.46));
        }

        .intro-grid {
          opacity: .1;
          background-image:
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 22px 22px;
        }

        .intro-stage {
          position: relative;
          width: min(46vw, 340px);
          aspect-ratio: 320 / 520;
        }

        .foot-wrap,
        .print-wrap {
          position: absolute;
          inset: 0;
          transition:
            transform ${FRAME_MS}ms cubic-bezier(.24,.74,.24,1),
            opacity ${FRAME_MS}ms ease,
            filter ${FRAME_MS}ms ease;
          transform-origin: center center;
        }

        .impact-ring {
          position: absolute;
          left: 51%;
          top: 69%;
          width: 46px;
          height: 46px;
          border: 1px solid rgba(255,255,255,.72);
          border-radius: 999px;
          transition:
            transform ${FRAME_MS}ms ease,
            opacity ${FRAME_MS}ms ease;
        }

        .intro-caption {
          position: absolute;
          bottom: 10svh;
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .42em;
          text-transform: uppercase;
          color: rgba(255,255,255,.8);
        }

        @keyframes fadeout {
          0%, 80% {
            opacity: 1;
            visibility: visible;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        @media (max-width: 640px) {
          .intro-stage {
            width: min(58vw, 250px);
          }

          .intro-caption {
            bottom: 12svh;
            font-size: 9px;
            letter-spacing: .34em;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-screen {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
