"use client";

import { useEffect, useState } from "react";

const INTRO_KEY = "girtz-intro-seen";

export function IntroMark() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hasSeenIntro = window.sessionStorage.getItem(INTRO_KEY) === "1";

    if (hasSeenIntro) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(INTRO_KEY, "1");
      setVisible(false);
    }, 2050);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="intro-screen" aria-hidden="true">
      <div className="intro-grid" />
      <div className="sole-impact">
        <div className="sole-mark">
          <span className="sole-tread sole-tread-a" />
          <span className="sole-tread sole-tread-b" />
          <span className="sole-tread sole-tread-c" />
          <strong>GIRTZ</strong>
          <small>WEAR</small>
        </div>
      </div>
      <p className="intro-caption">LEAVE YOUR MARK.</p>
    </div>
  );
}
