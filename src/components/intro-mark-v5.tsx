"use client";

import { useEffect, useState } from "react";

const FRAME_MS = 110;
const HOLD_MS = 520;

const frames = [
  { x: 180, y: -210, r: 19, s: 1.08, o: 0, b: 6, p: 0, ps: .84, logo: 0, ring: 0, rs: .5 },
  { x: 142, y: -155, r: 15, s: 1.06, o: 1, b: 4, p: 0, ps: .86, logo: 0, ring: 0, rs: .5 },
  { x: 98, y: -98, r: 11, s: 1.04, o: 1, b: 2, p: .03, ps: .9, logo: 0, ring: .1, rs: .7 },
  { x: 54, y: -48, r: 7, s: 1.02, o: 1, b: 1, p: .08, ps: .94, logo: 0, ring: .22, rs: 1 },
  { x: 18, y: -12, r: 3, s: 1.01, o: 1, b: 0, p: .22, ps: .98, logo: .05, ring: .5, rs: 1.4 },
  { x: 0, y: 0, r: 0, s: 1, o: 1, b: 0, p: .82, ps: 1, logo: .35, ring: .75, rs: 2 },
  { x: -10, y: 8, r: -2, s: .99, o: 1, b: 0, p: .92, ps: 1.01, logo: .72, ring: .42, rs: 3 },
  { x: -28, y: -20, r: -6, s: 1.01, o: .95, b: .3, p: .9, ps: 1.01, logo: .96, ring: .14, rs: 4 },
  { x: -78, y: -86, r: -10, s: 1.04, o: .55, b: 2, p: .88, ps: 1, logo: 1, ring: 0, rs: 5 },
  { x: -145, y: -180, r: -15, s: 1.07, o: 0, b: 5, p: .86, ps: 1, logo: 1, ring: 0, rs: 5 },
] as const;

const TOTAL_MS = frames.length * FRAME_MS + HOLD_MS;

function Sneaker() {
  return (
    <svg viewBox="0 0 360 520" aria-hidden="true" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="leg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#303030"/><stop offset="1" stopColor="#101010"/></linearGradient>
        <linearGradient id="upper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f5f5f1"/><stop offset=".45" stopColor="#c7c7c2"/><stop offset="1" stopColor="#70706d"/></linearGradient>
        <linearGradient id="sole" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#bcbcb7"/></linearGradient>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="9"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      </defs>
      <path d="M184 0c28 0 49 17 53 43 5 29-4 75-14 116l-26 105-88-10 23-105c10-47 17-94 29-124 5-14 12-25 23-25Z" fill="url(#leg)"/>
      <path d="M113 224c26-14 72-13 100 6 12 8 16 20 9 31-12 18-46 26-78 23-28-2-53-13-57-29-3-12 6-23 26-31Z" fill="#ecece7"/>
      <ellipse cx="179" cy="390" rx="136" ry="38" fill="rgba(0,0,0,.3)"/>
      <path d="M35 342c17-38 57-75 104-94 39-16 83-20 110-7 18 8 28 25 42 39 11 10 31 14 44 24 15 12 18 31 7 45-16 20-52 29-108 31H117c-39 0-73-6-91-18-12-8-9-13 9-20Z" fill="url(#upper)" stroke="rgba(255,255,255,.35)" strokeWidth="2"/>
      <path d="M54 330c39-34 89-61 146-72" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="4" strokeLinecap="round"/>
      <g stroke="#222" strokeWidth="3" strokeLinecap="round"><path d="M139 278l70-10"/><path d="M134 292l79-11"/><path d="M130 307l82-11"/><path d="M127 322l78-10"/></g>
      <path d="M92 338c28-16 59-27 94-33 23-4 45-5 66-4-13 13-29 24-48 34-26 14-56 21-88 22-15 0-28-2-38-6 3-5 8-9 14-13Z" fill="#101010"/>
      <path d="M25 364c14 17 46 27 91 29h167c34-1 60-7 75-20 10-9 11-20 3-31-10 11-29 18-58 21-39 4-89 3-148 4-52 1-95 5-130 12Z" fill="url(#sole)" stroke="rgba(255,255,255,.4)" strokeWidth="2"/>
      <g stroke="rgba(20,20,20,.38)" strokeWidth="4" strokeLinecap="round"><path d="M70 373l17 15"/><path d="M111 370l14 20"/><path d="M155 369l11 21"/><path d="M202 368l8 22"/><path d="M251 367l4 21"/><path d="M299 363l-2 20"/></g>
      <path d="M38 344c17-36 56-70 101-88 38-15 80-19 106-7" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="15" filter="url(#grain)" opacity=".32"/>
    </svg>
  );
}

function OutsolePrint({ logoOpacity }: { logoOpacity: number }) {
  return (
    <svg viewBox="0 0 220 500" aria-hidden="true" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".32" numOctaves="3" seed="13" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4"/></filter>
        <linearGradient id="ink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(245,245,240,.94)"/><stop offset="1" stopColor="rgba(190,190,185,.65)"/></linearGradient>
      </defs>
      <g filter="url(#rough)">
        <path d="M104 8c43 0 76 22 91 62 15 42 14 101 7 161l-18 151c-8 66-33 106-75 110-42 3-71-31-83-92C15 346 11 282 13 217c2-66 8-125 28-163C57 24 78 8 104 8Z" fill="url(#ink)" opacity=".88"/>
        <g fill="rgba(10,10,10,.24)">
          <path d="M48 62h126l-11 30H58Z"/><path d="M39 116h142l-7 28H43Z"/><path d="M32 170h150l-4 27H34Z"/><path d="M30 224h146v27H31Z"/><path d="M34 278h134l-3 28H38Z"/><path d="M43 333h111l-6 29H49Z"/><path d="M57 389h82l-10 42H67Z"/>
        </g>
        <g fill="rgba(255,255,255,.28)"><circle cx="48" cy="151" r="4"/><circle cx="166" cy="207" r="3"/><circle cx="52" cy="316" r="3"/><circle cx="146" cy="371" r="4"/></g>
      </g>
      <g opacity={logoOpacity}>
        <text x="110" y="238" textAnchor="middle" fill="#080808" fontSize="31" fontWeight="850" letterSpacing="-2">GIRTZ</text>
        <text x="110" y="262" textAnchor="middle" fill="#080808" fontSize="9" fontWeight="800" letterSpacing="5">WEAR</text>
      </g>
    </svg>
  );
}

export function IntroMark() {
  const [visible, setVisible] = useState(true);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }

    let current = 0;
    const frameTimer = window.setInterval(() => {
      current += 1;
      if (current >= frames.length - 1) {
        setFrame(frames.length - 1);
        window.clearInterval(frameTimer);
      } else {
        setFrame(current);
      }
    }, FRAME_MS);

    const hideTimer = window.setTimeout(() => setVisible(false), TOTAL_MS);
    return () => { window.clearInterval(frameTimer); window.clearTimeout(hideTimer); };
  }, []);

  if (!visible) return null;
  const f = frames[frame];

  return (
    <div className="girtz-intro" aria-hidden="true">
      <div className="intro-light" />
      <div className="intro-stage">
        <div className="impact-ring" style={{ opacity: f.ring, transform: `translate(-50%,-50%) scale(${f.rs})` }} />
        <div className="outsole-print" style={{ opacity: f.p, transform: `scale(${f.ps}) rotate(-8deg)` }}><OutsolePrint logoOpacity={f.logo} /></div>
        <div className="walking-foot" style={{ opacity: f.o, filter: `blur(${f.b}px)`, transform: `translate3d(${f.x}px,${f.y}px,0) rotate(${f.r}deg) scale(${f.s})` }}><Sneaker /></div>
      </div>
      <p>LEAVE YOUR MARK.</p>
      <style jsx>{`
        .girtz-intro{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;overflow:hidden;pointer-events:none;background:#050505;animation:introExit ${TOTAL_MS}ms cubic-bezier(.2,.8,.2,1) both}
        .intro-light{position:absolute;inset:0;background:radial-gradient(circle at 50% 54%,rgba(255,255,255,.09),transparent 25%),linear-gradient(180deg,rgba(255,255,255,.018),transparent 40%,rgba(0,0,0,.42))}
        .intro-stage{position:relative;width:min(54vw,390px);aspect-ratio:360/520}
        .walking-foot,.outsole-print{position:absolute;inset:0;transform-origin:center;transition:transform ${FRAME_MS}ms cubic-bezier(.22,.75,.25,1),opacity ${FRAME_MS}ms ease,filter ${FRAME_MS}ms ease}
        .outsole-print{inset:6% 20% 0 20%}
        .impact-ring{position:absolute;left:50%;top:72%;width:46px;height:46px;border:1px solid rgba(255,255,255,.7);border-radius:50%;transition:transform ${FRAME_MS}ms ease,opacity ${FRAME_MS}ms ease}
        p{position:absolute;bottom:9svh;margin:0;color:rgba(255,255,255,.78);font-size:10px;font-weight:700;letter-spacing:.44em}
        @keyframes introExit{0%,82%{opacity:1;visibility:visible}100%{opacity:0;visibility:hidden}}
        @media(max-width:640px){.intro-stage{width:min(72vw,300px)}p{bottom:11svh;font-size:9px;letter-spacing:.34em}}
        @media(prefers-reduced-motion:reduce){.girtz-intro{display:none}}
      `}</style>
    </div>
  );
}
