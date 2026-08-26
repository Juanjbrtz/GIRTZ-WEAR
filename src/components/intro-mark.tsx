export function IntroMark() {
  return (
    <div className="girtz-intro" aria-hidden="true">
      <div className="girtz-intro__bg" />
      <div className="girtz-intro__grain" />

      <div className="girtz-intro__stage">
        <div className="girtz-intro__floorGlow" />
        <div className="girtz-intro__impactRing" />
        <div className="girtz-intro__shadow" />

        <div className="girtz-intro__imprint">
          <Imprint3Q />
        </div>

        <div className="girtz-intro__step">
          <div className="girtz-intro__leg">
            <LowerLeg />
          </div>
          <div className="girtz-intro__shoe">
            <Sneaker3Q />
          </div>
        </div>
      </div>

      <p className="girtz-intro__caption">LEAVE YOUR MARK.</p>

      <style>{`
        .girtz-intro {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          overflow: hidden;
          pointer-events: none;
          display: grid;
          place-items: center;
          background: #040404;
          animation: introFade 2.35s cubic-bezier(0.22, 0.78, 0.24, 1) both;
        }

        .girtz-intro__bg,
        .girtz-intro__grain {
          position: absolute;
          inset: 0;
        }

        .girtz-intro__bg {
          background:
            radial-gradient(circle at 50% 56%, rgba(255,255,255,.08), transparent 24%),
            radial-gradient(circle at 50% 72%, rgba(255,255,255,.035), transparent 34%),
            linear-gradient(180deg, rgba(255,255,255,.015), transparent 38%, rgba(0,0,0,.48));
        }

        .girtz-intro__grain {
          opacity: .08;
          background-image:
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
          background-size: 22px 22px;
        }

        .girtz-intro__stage {
          position: relative;
          width: min(64vw, 520px);
          height: min(72vh, 760px);
          perspective: 1300px;
          transform-style: preserve-3d;
        }

        .girtz-intro__floorGlow {
          position: absolute;
          left: 50%;
          top: 63%;
          width: min(58vw, 380px);
          height: 170px;
          transform: translateX(-50%) rotateX(74deg) rotateZ(-14deg);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,.08) 0%, rgba(255,255,255,.03) 38%, transparent 72%);
          filter: blur(18px);
          opacity: .65;
        }

        .girtz-intro__impactRing {
          position: absolute;
          left: 49.6%;
          top: 61.3%;
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.7);
          transform: translate(-50%, -50%) scale(.35);
          opacity: 0;
          animation: impactPulse 2.35s ease-out both;
        }

        .girtz-intro__shadow {
          position: absolute;
          left: 49%;
          top: 62.8%;
          width: 270px;
          height: 84px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,0,0,.52) 0%, rgba(0,0,0,.22) 48%, transparent 78%);
          transform: translate(-50%, -50%) rotate(-14deg) scale(.55);
          filter: blur(8px);
          opacity: .15;
          animation: shadowStep 2.35s ease-in-out both;
        }

        .girtz-intro__imprint {
          position: absolute;
          left: 49.3%;
          top: 61.8%;
          width: min(42vw, 255px);
          transform: translate(-50%, -50%) rotateX(70deg) rotateZ(-14deg) scale(.84);
          transform-origin: center;
          opacity: 0;
          filter: blur(10px);
          animation: imprintReveal 2.35s cubic-bezier(.24,.76,.24,1) both;
        }

        .girtz-intro__step {
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(62vw, 430px);
          transform-origin: center;
          transform-style: preserve-3d;
          animation: stepMotion 2.35s cubic-bezier(.23,.8,.28,1) both;
          filter: blur(5px);
        }

        .girtz-intro__leg {
          position: absolute;
          left: 16%;
          top: -26%;
          width: 46%;
          transform: translateZ(-8px);
        }

        .girtz-intro__shoe {
          position: absolute;
          left: 6%;
          top: 26%;
          width: 88%;
          transform: translateZ(20px);
        }

        .girtz-intro__caption {
          position: absolute;
          bottom: 9.5svh;
          margin: 0;
          color: rgba(255,255,255,.82);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .42em;
          text-transform: uppercase;
          opacity: .9;
          animation: captionFade 2.35s ease both;
        }

        @keyframes introFade {
          0%, 86% {
            opacity: 1;
            visibility: visible;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes captionFade {
          0% { opacity: 0; transform: translateY(12px); }
          18% { opacity: .85; transform: translateY(0); }
          88% { opacity: .85; }
          100% { opacity: 0; }
        }

        @keyframes stepMotion {
          0% {
            transform:
              translate3d(22vw, -16vh, 180px)
              rotateZ(-18deg)
              rotateY(-24deg)
              rotateX(12deg)
              scale3d(1.04,1.04,1.04);
            opacity: 0;
            filter: blur(7px);
          }
          16% {
            opacity: 1;
            filter: blur(4px);
          }
          40% {
            transform:
              translate3d(7vw, -5vh, 80px)
              rotateZ(-16deg)
              rotateY(-19deg)
              rotateX(14deg)
              scale3d(1.02,1.02,1.02);
            filter: blur(1.8px);
          }
          54% {
            transform:
              translate3d(0, 0, 0)
              rotateZ(-14deg)
              rotateY(-16deg)
              rotateX(15deg)
              scale3d(1, .965, 1);
            opacity: 1;
            filter: blur(0);
          }
          60% {
            transform:
              translate3d(-1.2vw, .8vh, 0)
              rotateZ(-13deg)
              rotateY(-16deg)
              rotateX(15deg)
              scale3d(1.01, .945, 1);
            opacity: 1;
            filter: blur(0);
          }
          73% {
            transform:
              translate3d(-5vw, -6vh, 70px)
              rotateZ(-10deg)
              rotateY(-12deg)
              rotateX(13deg)
              scale3d(1.02,1.01,1.02);
            opacity: 1;
            filter: blur(1px);
          }
          100% {
            transform:
              translate3d(-18vw, -18vh, 180px)
              rotateZ(-6deg)
              rotateY(-9deg)
              rotateX(12deg)
              scale3d(1.02,1.02,1.02);
            opacity: 0;
            filter: blur(5px);
          }
        }

        @keyframes shadowStep {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(-14deg) scale(.42);
            filter: blur(12px);
          }
          20% {
            opacity: .22;
          }
          46% {
            opacity: .35;
            transform: translate(-50%, -50%) rotate(-14deg) scale(.78);
            filter: blur(10px);
          }
          56% {
            opacity: .66;
            transform: translate(-50%, -50%) rotate(-14deg) scale(1.04);
            filter: blur(7px);
          }
          64% {
            opacity: .58;
            transform: translate(-50%, -50%) rotate(-14deg) scale(.96);
            filter: blur(8px);
          }
          78% {
            opacity: .26;
            transform: translate(-50%, -50%) rotate(-14deg) scale(.76);
            filter: blur(10px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(-14deg) scale(.5);
            filter: blur(13px);
          }
        }

        @keyframes impactPulse {
          0%, 48% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(.35);
          }
          55% {
            opacity: .82;
            transform: translate(-50%, -50%) scale(1.15);
          }
          64% {
            opacity: .38;
            transform: translate(-50%, -50%) scale(2.6);
          }
          75% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(4.1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(4.1);
          }
        }

        @keyframes imprintReveal {
          0%, 47% {
            opacity: 0;
            filter: blur(10px);
            transform: translate(-50%, -50%) rotateX(70deg) rotateZ(-14deg) scale(.78);
          }
          55% {
            opacity: .72;
            filter: blur(2px);
            transform: translate(-50%, -50%) rotateX(70deg) rotateZ(-14deg) scale(1.02);
          }
          63% {
            opacity: .95;
            filter: blur(0);
            transform: translate(-50%, -50%) rotateX(70deg) rotateZ(-14deg) scale(1);
          }
          84% {
            opacity: .92;
            filter: blur(0);
            transform: translate(-50%, -50%) rotateX(70deg) rotateZ(-14deg) scale(1);
          }
          100% {
            opacity: 0;
            filter: blur(2px);
            transform: translate(-50%, -50%) rotateX(70deg) rotateZ(-14deg) scale(.98);
          }
        }

        @media (max-width: 768px) {
          .girtz-intro__stage {
            width: min(82vw, 420px);
            height: min(74vh, 700px);
          }

          .girtz-intro__imprint {
            width: min(52vw, 235px);
            top: 62.4%;
          }

          .girtz-intro__shadow {
            width: 220px;
            height: 72px;
            top: 63%;
          }

          .girtz-intro__caption {
            bottom: 11svh;
            font-size: 9px;
            letter-spacing: .34em;
          }
        }
      `}</style>
    </div>
  );
}

function LowerLeg() {
  return (
    <svg viewBox="0 0 180 290" width="100%" height="100%">
      <defs>
        <linearGradient id="legGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e2e2e" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
      </defs>

      <path
        d="M112 8c23 0 43 13 50 31 8 21 4 45-3 68-10 33-26 71-35 102-10 34-17 56-34 68-14 10-35 12-52 4-18-9-30-28-31-50-1-25 10-49 20-74 12-28 22-58 30-88 5-18 11-34 23-45C90 13 101 8 112 8Z"
        fill="url(#legGrad)"
        opacity="0.98"
      />
    </svg>
  );
}

function Sneaker3Q() {
  return (
    <svg viewBox="0 0 420 230" width="100%" height="100%">
      <defs>
        <linearGradient id="upperBase" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7f7f3" />
          <stop offset="45%" stopColor="#d9d9d5" />
          <stop offset="100%" stopColor="#9b9b96" />
        </linearGradient>

        <linearGradient id="soleBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cdcdc8" />
        </linearGradient>

        <linearGradient id="outsoleBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#efefeb" />
          <stop offset="100%" stopColor="#ddddda" />
        </linearGradient>
      </defs>

      <ellipse
        cx="210"
        cy="170"
        rx="170"
        ry="30"
        fill="rgba(0,0,0,.08)"
      />

      <path
        d="M45 145c14-27 38-49 70-66 28-15 61-25 90-27 17-1 31 1 42 7 9 5 18 13 26 22 8 9 17 17 30 22 17 7 37 12 51 24 11 9 17 21 15 33-1 12-10 22-25 29-18 9-46 14-84 14H157c-36 0-65-4-84-12-23-9-35-23-35-40 0-2 0-4 1-6 1 0 1 0 1 0Z"
        fill="url(#upperBase)"
        stroke="rgba(255,255,255,.42)"
        strokeWidth="2"
      />

      <path
        d="M106 116c29-22 63-38 102-46 20-4 41-6 59-5"
        fill="none"
        stroke="rgba(255,255,255,.36)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M82 152c31-8 66-12 105-13 62-2 118 4 169 17"
        fill="none"
        stroke="rgba(0,0,0,.16)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d="M112 106c26 3 50 1 70-6 14-5 28-13 40-24 18 1 32 6 43 14-10 10-23 19-39 27-31 15-70 24-114 25-21 1-39-1-54-5 12-15 30-27 54-31Z"
        fill="#121212"
        opacity="0.95"
      />

      <g stroke="#2a2a2a" strokeWidth="2.5" strokeLinecap="round" opacity=".92">
        <line x1="188" y1="83" x2="255" y2="79" />
        <line x1="183" y1="95" x2="252" y2="91" />
        <line x1="177" y1="107" x2="247" y2="103" />
        <line x1="171" y1="119" x2="242" y2="115" />
      </g>

      <path
        d="M286 102c21 7 42 20 54 35 5 7 7 15 4 22-5 12-20 19-41 23"
        fill="none"
        stroke="rgba(255,255,255,.3)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M42 160c7 10 20 19 39 25 20 7 46 10 76 10h154c27 0 49-3 68-10 18-6 30-15 33-28 1-5 1-10-1-15-12 6-26 10-44 12-20 3-45 4-75 4H148c-32 0-63 3-93 9-5 1-9 2-13 3Z"
        fill="url(#soleBase)"
        stroke="rgba(255,255,255,.36)"
        strokeWidth="2"
      />

      <path
        d="M39 165c12 16 33 28 62 34 20 4 40 6 59 6h150c30 0 56-4 76-12 17-6 29-16 34-29v10c0 18-11 31-33 40-21 8-47 12-78 12H159c-37 0-69-4-94-13-24-9-38-22-42-40l16-8Z"
        fill="url(#outsoleBase)"
        opacity=".9"
      />

      <g stroke="rgba(60,60,60,.45)" strokeWidth="3" strokeLinecap="round">
        <line x1="78" y1="186" x2="94" y2="204" />
        <line x1="120" y1="183" x2="136" y2="206" />
        <line x1="166" y1="182" x2="180" y2="207" />
        <line x1="213" y1="181" x2="223" y2="208" />
        <line x1="260" y1="181" x2="265" y2="208" />
        <line x1="306" y1="183" x2="304" y2="209" />
        <line x1="350" y1="186" x2="344" y2="206" />
      </g>
    </svg>
  );
}

function Imprint3Q() {
  return (
    <svg viewBox="0 0 220 430" width="100%" height="100%">
      <defs>
        <linearGradient id="printFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,.96)" />
          <stop offset="100%" stopColor="rgba(206,206,201,.78)" />
        </linearGradient>
      </defs>

      <path
        d="M90 18c27 0 51 8 67 24 22 22 35 53 41 92 5 34 7 72 4 112-5 61-20 112-42 142-16 22-39 33-67 35-31 3-58-8-79-30-27-29-44-78-50-145-5-50-4-94 7-134 7-27 18-48 35-64C37 29 61 19 90 18Z"
        fill="url(#printFill)"
        opacity=".92"
      />

      <g fill="rgba(20,20,20,.13)">
        <rect x="55" y="54" width="110" height="23" rx="11" transform="rotate(-5 110 66)" />
        <rect x="47" y="97" width="126" height="22" rx="11" transform="rotate(-4 110 108)" />
        <rect x="44" y="140" width="130" height="22" rx="11" transform="rotate(-3 109 151)" />
        <rect x="45" y="185" width="125" height="21" rx="10.5" transform="rotate(-2 107 195)" />
        <rect x="51" y="228" width="116" height="20" rx="10" transform="rotate(-1 109 238)" />
        <rect x="61" y="269" width="102" height="20" rx="10" />
        <rect x="72" y="310" width="86" height="19" rx="9.5" transform="rotate(2 115 319)" />
        <rect x="87" y="349" width="61" height="20" rx="10" transform="rotate(3 117 359)" />
      </g>

      <g fill="rgba(255,255,255,.18)">
        <circle cx="60" cy="138" r="4" />
        <circle cx="154" cy="168" r="4" />
        <circle cx="72" cy="274" r="4" />
        <circle cx="166" cy="310" r="5" />
      </g>

      <text
        x="110"
        y="205"
        textAnchor="middle"
        fontSize="30"
        fontWeight="800"
        letterSpacing="-1.8"
        fill="#0a0a0a"
      >
        GIRTZ
      </text>
      <text
        x="110"
        y="227"
        textAnchor="middle"
        fontSize="9"
        fontWeight="800"
        letterSpacing="5"
        fill="#0a0a0a"
      >
        WEAR
      </text>
    </svg>
  );
}
