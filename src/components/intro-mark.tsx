"use client";

import { useEffect, useState } from "react";

const INTRO_KEY = "girtz-intro-seen-v2";
const INTRO_DURATION_MS = 1900;

function markIntroAsSeen() {
  try {
    window.sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    // Storage can be unavailable in strict privacy modes. The intro must
    // never prevent access to the store if that happens.
  }
}

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function IntroMark() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || hasSeenIntro()) {
      markIntroAsSeen();
      return;
    }

    setVisible(true);
    markIntroAsSeen();

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, INTRO_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="intro-screen"
      aria-hidden="true"
      onAnimationEnd={() => setVisible(false)}
    >
      <div className="intro-vignette" />

      <div className="impact-stage">
        <div className="falling-sole" aria-hidden="true">
          <span className="tread tread-a" />
          <span className="tread tread-b" />
          <span className="tread tread-c" />
          <span className="tread tread-d" />
        </div>

        <div className="impact-ring" />

        <div className="footprint-mark">
          <span className="print-heel" />
          <span className="print-body" />
          <span className="print-toe" />
          <div className="print-wordmark">
            <strong>GIRTZ</strong>
            <small>WEAR</small>
          </div>
        </div>
      </div>

      <style jsx>{`
        .intro-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          overflow: hidden;
          pointer-events: none;
          background: #050505;
          animation: intro-layer 1.9s cubic-bezier(.22,.78,.24,1) both;
        }

        .intro-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 52%, rgba(255,255,255,.055), transparent 27%),
            linear-gradient(180deg, rgba(255,255,255,.018), transparent 35%, rgba(0,0,0,.34));
        }

        .impact-stage {
          position: relative;
          width: min(46vw, 260px);
          aspect-ratio: .47;
          transform: rotate(-8deg);
        }

        .falling-sole,
        .footprint-mark {
          position: absolute;
          inset: 0;
          border-radius: 48% 48% 42% 42% / 28% 28% 18% 18%;
          clip-path: polygon(31% 0, 68% 2%, 84% 12%, 93% 31%, 90% 55%, 78% 72%, 72% 94%, 55% 100%, 37% 96%, 27% 78%, 14% 66%, 8% 46%, 12% 23%);
        }

        .falling-sole {
          z-index: 3;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.38);
          background:
            linear-gradient(145deg, #f2f2ee 0%, #a5a5a0 38%, #4b4b49 74%, #171717 100%);
          box-shadow:
            inset 0 0 0 7px rgba(5,5,5,.22),
            0 22px 55px rgba(0,0,0,.55);
          animation: sole-strike 1.02s cubic-bezier(.2,.84,.28,1) both;
        }

        .tread {
          position: absolute;
          display: block;
          border: 2px solid rgba(5,5,5,.55);
          border-radius: 999px;
        }

        .tread-a {
          top: 11%;
          left: 22%;
          width: 56%;
          height: 20%;
          transform: rotate(5deg);
        }

        .tread-b {
          top: 38%;
          left: 14%;
          width: 72%;
          height: 15%;
          transform: rotate(-4deg);
        }

        .tread-c {
          top: 58%;
          left: 24%;
          width: 58%;
          height: 13%;
          transform: rotate(7deg);
        }

        .tread-d {
          bottom: 10%;
          left: 32%;
          width: 38%;
          height: 14%;
          transform: rotate(-8deg);
        }

        .footprint-mark {
          z-index: 1;
          opacity: 0;
          background: rgba(236,236,230,.09);
          box-shadow:
            0 0 0 1px rgba(255,255,255,.13),
            0 0 48px rgba(255,255,255,.07);
          animation: print-reveal .82s cubic-bezier(.18,.9,.25,1) .55s both;
        }

        .print-heel,
        .print-body,
        .print-toe {
          position: absolute;
          left: 50%;
          display: block;
          transform: translateX(-50%);
          background: repeating-linear-gradient(
            90deg,
            rgba(242,242,237,.75) 0 5px,
            rgba(242,242,237,.19) 5px 9px
          );
        }

        .print-toe {
          top: 8%;
          width: 61%;
          height: 22%;
          border-radius: 48% 48% 38% 38%;
        }

        .print-body {
          top: 36%;
          width: 68%;
          height: 29%;
          border-radius: 42% 42% 30% 30%;
          opacity: .72;
        }

        .print-heel {
          bottom: 8%;
          width: 42%;
          height: 20%;
          border-radius: 35%;
          opacity: .65;
        }

        .print-wordmark {
          position: absolute;
          z-index: 2;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transform: rotate(90deg);
          color: #050505;
          mix-blend-mode: screen;
          filter: invert(1);
          opacity: 0;
          animation: wordmark-reveal .45s ease .82s both;
        }

        .print-wordmark strong {
          font-size: clamp(24px, 4vw, 42px);
          font-weight: 760;
          letter-spacing: -.075em;
          line-height: .8;
        }

        .print-wordmark small {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .36em;
        }

        .impact-ring {
          position: absolute;
          z-index: 0;
          left: 50%;
          top: 53%;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255,255,255,.65);
          border-radius: 50%;
          opacity: 0;
          transform: translate(-50%, -50%) scale(.5);
          animation: impact-ring .58s ease-out .53s both;
        }

        @keyframes sole-strike {
          0% {
            opacity: 0;
            transform: translate3d(34vw, -78vh, 0) rotate(24deg) scale(1.18);
            filter: blur(5px);
          }
          18% {
            opacity: 1;
          }
          58% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
            filter: blur(0);
          }
          64% {
            transform: translate3d(0, 8px, 0) rotate(0deg) scale(.985);
          }
          78% {
            opacity: 1;
            transform: translate3d(-3vw, -12vh, 0) rotate(-8deg) scale(1.03);
          }
          100% {
            opacity: 0;
            transform: translate3d(-20vw, -62vh, 0) rotate(-20deg) scale(1.08);
            filter: blur(4px);
          }
        }

        @keyframes print-reveal {
          0% {
            opacity: 0;
            transform: scale(.86);
            filter: blur(8px);
          }
          55% {
            opacity: .96;
          }
          100% {
            opacity: .82;
            transform: scale(1);
            filter: blur(0);
          }
        }

        @keyframes wordmark-reveal {
          from { opacity: 0; transform: rotate(90deg) scale(.92); }
          to { opacity: .95; transform: rotate(90deg) scale(1); }
        }

        @keyframes impact-ring {
          0% { opacity: .7; transform: translate(-50%, -50%) scale(.45); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(8); }
        }

        @keyframes intro-layer {
          0%, 73% {
            opacity: 1;
            visibility: visible;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        @media (max-width: 640px) {
          .impact-stage {
            width: min(48vw, 190px);
          }

          .falling-sole {
            animation-name: sole-strike-mobile;
          }

          @keyframes sole-strike-mobile {
            0% {
              opacity: 0;
              transform: translate3d(28vw, -65vh, 0) rotate(20deg) scale(1.15);
              filter: blur(4px);
            }
            18% { opacity: 1; }
            58% {
              transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
              filter: blur(0);
            }
            64% { transform: translate3d(0, 6px, 0) rotate(0deg) scale(.985); }
            78% {
              opacity: 1;
              transform: translate3d(-5vw, -10vh, 0) rotate(-7deg) scale(1.03);
            }
            100% {
              opacity: 0;
              transform: translate3d(-24vw, -54vh, 0) rotate(-18deg) scale(1.06);
              filter: blur(3px);
            }
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
