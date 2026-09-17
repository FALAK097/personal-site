"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const TURN_DURATION = 1000;

function BoatWake() {
  return (
    <svg className="footer-boat-wake footer-water-motion" viewBox="0 0 140 32" fill="none" aria-hidden="true">
      <g className="footer-wake-ripples footer-water-motion">
        <path d="M138 16C104 14 70 7 2 2M138 16C103 19 68 26 2 30" />
        <path d="M130 16C96 13 49 13 12 8M130 17C92 20 49 19 10 25" opacity="0.55" />
      </g>
      <path className="footer-wake-foam footer-water-motion" d="M131 16h-8m-7 1h-9m-6-2h-10m-5 3H74m-6-2H55m-8 3H34m-6-4H15" />
    </svg>
  );
}

function WaterfrontImage() {
  return (
    <>
      <Image src="/images/mumbai-waterfront-day.webp" alt="" width={2172} height={724} sizes="(max-width: 960px) 960px, 100vw" className="footer-landscape footer-landscape-day" />
      <Image src="/images/mumbai-waterfront-night.webp" alt="" width={2172} height={724} sizes="(max-width: 960px) 960px, 100vw" className="footer-landscape footer-landscape-night" />
    </>
  );
}

export function FooterSeascape() {
  const sceneRef = useRef(null);
  const [sailing, setSailing] = useState(false);
  const [turning, setTurning] = useState(false);
  const [heading, setHeading] = useState("east");
  const [atRightShore, setAtRightShore] = useState(false);
  const [hasSailed, setHasSailed] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    let inView = false;
    const updateMotion = () => {
      scene.dataset.active = String(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateMotion();
    });
    observer.observe(scene);
    document.addEventListener("visibilitychange", updateMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateMotion);
    };
  }, []);

  useEffect(() => {
    if (!turning) return;
    // Complete even if a theme switch interrupts the visual transition.
    const timer = window.setTimeout(() => {
      setTurning(false);
      setSailing(true);
    }, TURN_DURATION);
    return () => window.clearTimeout(timer);
  }, [turning]);

  const boatLabel = atRightShore ? "Sail the boat back to the left shore" : "Sail the boat to the right shore";

  return (
    <div ref={sceneRef} className="footer-seascape" data-active="false">
      <span className="sr-only" role="status">
        {turning ? "The boat is turning toward the other shore." : sailing ? "Bon voyage! The boat is crossing the waterfront." : hasSailed ? `The boat has reached the ${atRightShore ? "right" : "left"} shore. Click it to sail back.` : ""}
      </span>
      <div className="footer-scene">
        <WaterfrontImage />
        <div className="footer-water" aria-hidden="true">
          <div className="footer-water-drift footer-water-motion"><WaterfrontImage /></div>
          <div className="footer-water-glints footer-water-motion" />
        </div>
        <div className="footer-boat-course">
          <button
            type="button"
            className={`footer-boat${sailing ? " is-sailing" : ""}`}
            data-shore={atRightShore ? "right" : "left"}
            data-heading={heading}
            data-turning={turning}
            style={{ "--boat-turn-duration": `${TURN_DURATION}ms` }}
            aria-label={boatLabel}
            title={boatLabel}
            aria-disabled={sailing || turning}
            onClick={() => {
              if (sailing || turning) return;
              const nextHeading = atRightShore ? "west" : "east";
              const needsTurn = heading !== nextHeading;
              setHeading(nextHeading);
              if (needsTurn && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                setTurning(true);
              } else {
                setSailing(true);
              }
            }}
            onAnimationEnd={(event) => {
              if (event.target !== event.currentTarget) return;
              setSailing(false);
              setAtRightShore((previous) => !previous);
              setHasSailed(true);
            }}
          >
            {sailing ? <span className="footer-bon-voyage" aria-hidden="true">Bon voyage!</span> : null}
            <span className="footer-vessel-direction">
              <span className="footer-vessel footer-water-motion">
                <Image className="footer-vessel-image" src="/images/mumbai-fishing-boat.webp" alt="" width={480} height={220} sizes="120px" />
                <Image className="footer-vessel-reflection" src="/images/mumbai-fishing-boat.webp" alt="" width={480} height={220} sizes="120px" aria-hidden="true" />
              </span>
              <BoatWake />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
