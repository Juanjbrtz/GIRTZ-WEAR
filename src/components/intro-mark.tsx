export function IntroMark() {
  return (
    <div className="girtz-intro-static" aria-hidden="true">
      <div className="girtz-intro-light" />
      <div className="girtz-intro-stage">
        <div className="girtz-impact-ring" />

        <div className="girtz-outsole-print">
          <svg viewBox="0 0 220 500" style={{ width: "100%", height: "100%", display: "block" }}>
            <defs>
              <linearGradient id="girtzInk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(245,245,240,.96)" />
                <stop offset="1" stopColor="rgba(190,190,185,.66)" />
              </linearGradient>
              <filter id="girtzRough" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency=".35" numOctaves="3" seed="13" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.8" />
              </filter>
            </defs>

            <g filter="url(#girtzRough)">
              <path
                d="M104 8c43 0 76 22 91 62 15 42 14 101 7 161l-18 151c-8 66-33 106-75 110-42 3-71-31-83-92C15 346 11 282 13 217c2-66 8-125 28-163C57 24 78 8 104 8Z"
                fill="url(#girtzInk)"
                opacity=".9"
              />

              <g fill="rgba(10,10,10,.25)">
                <path d="M50 58h122l-8 31H57Z" />
                <path d="M41 109h139l-6 29H45Z" />
                <path d="M34 161h148l-5 29H37Z" />
                <path d="M30 214h149v29H31Z" />
                <path d="M32 268h141l-4 29H35Z" />
                <path d="M39 322h124l-6 31H45Z" />
                <path d="M51 378h99l-8 34H59Z" />
                <path d="M69 431h65l-10 42H80Z" />
              </g>

              <g fill="rgba(255,255,255,.32)">
                <circle cx="55" cy="145" r="4" />
                <circle cx="165" cy="200" r="3" />
                <circle cx="48" cy="292" r="3" />
                <circle cx="156" cy="351" r="4" />
              </g>
            </g>

            <g className="girtz-print-logo">
              <text x="110" y="239" textAnchor="middle" fill="#080808" fontSize="31" fontWeight="850" letterSpacing="-2">GIRTZ</text>
              <text x="110" y="263" textAnchor="middle" fill="#080808" fontSize="9" fontWeight="800" letterSpacing="5">WEAR</text>
            </g>
          </svg>
        </div>

        <div className="girtz-walking-foot">
          <svg viewBox="0 0 360 520" style={{ width: "100%", height: "100%", display: "block" }}>
            <defs>
              <linearGradient id="girtzLeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#303030" />
                <stop offset="1" stopColor="#101010" />
              </linearGradient>
              <linearGradient id="girtzUpper" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f5f5f1" />
                <stop offset=".45" stopColor="#c7c7c2" />
                <stop offset="1" stopColor="#70706d" />
              </linearGradient>
              <linearGradient id="girtzSole" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" />
                <stop offset="1" stopColor="#bcbcb7" />
              </linearGradient>
              <filter id="girtzGrain" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="9" result="grain" />
                <feColorMatrix in="grain" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .10 0" />
              </filter>
            </defs>

            <path d="M184 0c28 0 49 17 53 43 5 29-4 75-14 116l-26 105-88-10 23-105c10-47 17-94 29-124 5-14 12-25 23-25Z" fill="url(#girtzLeg)" />
            <path d="M113 224c26-14 72-13 100 6 12 8 16 20 9 31-12 18-46 26-78 23-28-2-53-13-57-29-3-12 6-23 26-31Z" fill="#ecece7" />
            <ellipse cx="179" cy="390" rx="136" ry="38" fill="rgba(0,0,0,.3)" />

            <path
              d="M35 342c17-38 57-75 104-94 39-16 83-20 110-7 18 8 28 25 42 39 11 10 31 14 44 24 15 12 18 31 7 45-16 20-52 29-108 31H117c-39 0-73-6-91-18-12-8-9-13 9-20Z"
              fill="url(#girtzUpper)"
              stroke="rgba(255,255,255,.35)"
              strokeWidth="2"
            />
            <path d="M54 330c39-34 89-61 146-72" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="4" strokeLinecap="round" />
            <g stroke="#222" strokeWidth="3" strokeLinecap="round">
              <path d="M139 278l70-10" />
              <path d="M134 292l79-11" />
              <path d="M130 307l82-11" />
              <path d="M127 322l78-10" />
            </g>
            <path d="M92 338c28-16 59-27 94-33 23-4 45-5 66-4-13 13-29 24-48 34-26 14-56 21-88 22-15 0-28-2-38-6 3-5 8-9 14-13Z" fill="#101010" />
            <path d="M25 364c14 17 46 27 91 29h167c34-1 60-7 75-20 10-9 11-20 3-31-10 11-29 18-58 21-39 4-89 3-148 4-52 1-95 5-130 12Z" fill="url(#girtzSole)" stroke="rgba(255,255,255,.4)" strokeWidth="2" />
            <g stroke="rgba(20,20,20,.38)" strokeWidth="4" strokeLinecap="round">
              <path d="M70 373l17 15" />
              <path d="M111 370l14 20" />
              <path d="M155 369l11 21" />
              <path d="M202 368l8 22" />
              <path d="M251 367l4 21" />
              <path d="M299 363l-2 20" />
            </g>
            <path d="M42 337c24-37 70-68 121-83 35-10 66-12 88-4" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="13" filter="url(#girtzGrain)" opacity=".32" />
          </svg>
        </div>
      </div>

      <p className="girtz-intro-caption">LEAVE YOUR MARK.</p>

      <style>{`
        .girtz-intro-static {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          display: grid;
          place-items: center;
          overflow: hidden;
          pointer-events: none;
          background: #050505;
          opacity: 1;
          visibility: visible;
          animation: girtzIntroExit 2.35s cubic-bezier(.2,.8,.2,1) both;
        }

        .girtz-intro-light {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 54%, rgba(255,255,255,.11), transparent 24%),
            linear-gradient(180deg, rgba(255,255,255,.02), transparent 40%, rgba(0,0,0,.46));
        }

        .girtz-intro-stage {
          position: relative;
          width: min(54vw, 390px);
          aspect-ratio: 360 / 520;
        }

        .girtz-walking-foot,
        .girtz-outsole-print,
        .girtz-impact-ring {
          position: absolute;
        }

        .girtz-walking-foot {
          inset: 0;
          transform-origin: 52% 76%;
          animation: girtzWalk 1.55s linear both;
          will-change: transform, opacity, filter;
        }

        .girtz-outsole-print {
          inset: 6% 20% 0 20%;
          opacity: 0;
          transform: scale(.84) rotate(-8deg);
          transform-origin: center;
          animation: girtzPrint 1.5s linear .42s both;
        }

        .girtz-print-logo {
          opacity: 0;
          animation: girtzLogo .55s ease .92s both;
        }

        .girtz-impact-ring {
          left: 50%;
          top: 72%;
          width: 46px;
          height: 46px;
          border: 1px solid rgba(255,255,255,.72);
          border-radius: 50%;
          opacity: 0;
          transform: translate(-50%,-50%) scale(.5);
          animation: girtzRing .55s ease-out .72s both;
        }

        .girtz-intro-caption {
          position: absolute;
          bottom: 9svh;
          margin: 0;
          color: rgba(255,255,255,.8);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .44em;
          text-transform: uppercase;
        }

        @keyframes girtzWalk {
          0%   { opacity: 0; transform: translate3d(180px,-210px,0) rotate(19deg) scale(1.08); filter: blur(6px); }
          10%  { opacity: 1; transform: translate3d(142px,-155px,0) rotate(15deg) scale(1.06); filter: blur(4px); }
          22%  { opacity: 1; transform: translate3d(98px,-98px,0) rotate(11deg) scale(1.04); filter: blur(2px); }
          34%  { opacity: 1; transform: translate3d(54px,-48px,0) rotate(7deg) scale(1.02); filter: blur(1px); }
          46%  { opacity: 1; transform: translate3d(18px,-12px,0) rotate(3deg) scale(1.01); filter: blur(0); }
          56%  { opacity: 1; transform: translate3d(0,0,0) rotate(0deg) scale(1); filter: blur(0); }
          63%  { opacity: 1; transform: translate3d(-10px,8px,0) rotate(-2deg) scale(.99); filter: blur(0); }
          74%  { opacity: .95; transform: translate3d(-28px,-20px,0) rotate(-6deg) scale(1.01); filter: blur(.3px); }
          86%  { opacity: .55; transform: translate3d(-78px,-86px,0) rotate(-10deg) scale(1.04); filter: blur(2px); }
          100% { opacity: 0; transform: translate3d(-145px,-180px,0) rotate(-15deg) scale(1.07); filter: blur(5px); }
        }

        @keyframes girtzPrint {
          0%, 18% { opacity: 0; transform: scale(.84) rotate(-8deg); }
          36% { opacity: .08; transform: scale(.92) rotate(-8deg); }
          50% { opacity: .22; transform: scale(.98) rotate(-8deg); }
          62% { opacity: .82; transform: scale(1) rotate(-8deg); }
          78% { opacity: .92; transform: scale(1.01) rotate(-8deg); }
          100% { opacity: .86; transform: scale(1) rotate(-8deg); }
        }

        @keyframes girtzLogo {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes girtzRing {
          0% { opacity: .72; transform: translate(-50%,-50%) scale(.5); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(5); }
        }

        @keyframes girtzIntroExit {
          0%, 82% { opacity: 1; visibility: visible; }
          100% { opacity: 0; visibility: hidden; }
        }

        @media (max-width: 640px) {
          .girtz-intro-stage { width: min(72vw, 300px); }
          .girtz-intro-caption { bottom: 11svh; font-size: 9px; letter-spacing: .34em; }
        }
      `}</style>
    </div>
  );
}
